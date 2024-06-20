import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrder(orderId: number) {
    const order = await this.prisma.prismaClient.order.findUnique({
      where: { orderId },
      include: {
        orderItems: {
          select: {
            productId: true,
            quantity: true,
            product: {
              select: {
                name: true,
                description: true,
                price: true,
              },
            },
          },
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    else return order;
  }

  async updateOrderStatus(orderId: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.prismaClient.order.findUnique({
      where: { orderId },
      include: {
        orderItems: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (updateOrderDto.status === order.status)
      throw new ConflictException('Order status is already the same');
    return await this.prisma.prismaClient.$transaction(async (prisma) => {
      const updatedOrder = await prisma.order.update({
        where: { orderId },
        data: { status: updateOrderDto.status },
      });

      if (updateOrderDto.status === 'Canceled') {
        const updateStock = order.orderItems.map((item) =>
          prisma.product.update({
            where: { productId: item.productId },
            data: { stock: { increment: item.quantity } },
          }),
        );

        await Promise.all(updateStock);
      }

      return updatedOrder;
    });
  }

  async applyCoupon(createOrderDto: CreateOrderDto) {
    const order = await this.prisma.prismaClient.order.findUnique({
      where: { orderId: createOrderDto.orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    return await this.prisma.prismaClient.order.update({
      where: { orderId: createOrderDto.orderId },
      data: { total: order.total * ((100 - createOrderDto.discount) / 100) },
    });
  }

  async createOrder(userId: number) {
    const cart = await this.prisma.prismaClient.cart.findFirst({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!cart) throw new NotFoundException('User not found');

    for (const item of cart.cartItems) {
      if (item.quantity > item.product.stock) {
        throw new ConflictException(
          `${item.product.name} is not available in the required quantity`,
        );
      }
    }

    let order;
    await this.prisma.prismaClient.$transaction(async (prisma) => {
      // Update product stock
      const updateStock = cart.cartItems.map((item) =>
        prisma.product.update({
          where: { productId: item.productId },
          data: { stock: { decrement: item.quantity } },
        }),
      );
      await Promise.all(updateStock);

      // Create order
      order = await prisma.order.create({
        data: {
          orderDate: new Date(),
          status: 'Pending',
          userId,
          total: cart.total,
        },
      });

      // Create order items
      await prisma.orderItem.createMany({
        data: cart.cartItems.map((item) => ({
          orderId: order.orderId,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      // Clear the cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.cartId },
      });
      await prisma.cart.update({
        where: { cartId: cart.cartId },
        data: { total: 0 },
      });
    });

    return order;
  }
}
