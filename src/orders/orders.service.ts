import {
  ConflictException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
Fetch an order by its ID.
@param {number} orderId - The ID of the order to fetch.
@returns {Promise<object>} - The order details.
@throws {NotFoundException} - If the order is not found.
*/
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

  /**
Update the status of an order.
@param {number} orderId - The ID of the order to update.
@param {UpdateOrderDto} updateOrderDto - The new status for the order.
@returns {Promise<object>} - The updated order.
@throws {NotFoundException} - If the order is not found.
@throws {ConflictException} - If the new status is the same as the current status.
*/
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

  /**
Apply a coupon to an order.
@param {CreateOrderDto} createOrderDto - The DTO containing order ID and coupon code.
@returns {Promise<object>} - The updated order with the discounted total.
@throws {NotFoundException} - If the order or coupon is not found.
@throws {GoneException} - If the coupon is expired.
*/
  async applyCoupon(createOrderDto: CreateOrderDto) {
    const order = await this.prisma.prismaClient.order.findUnique({
      where: { orderId: createOrderDto.orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    const coupon = await this.prisma.prismaClient.coupon.findUnique({
      where: { code: createOrderDto.code },
    });

    if (!coupon) throw new NotFoundException('Coupon not found');

    if (coupon.expiration < new Date())
      throw new GoneException('Coupon expired');

    return await this.prisma.prismaClient.order.update({
      where: { orderId: createOrderDto.orderId },
      data: { total: order.total * ((100 - coupon.discount) / 100) },
    });
  }

  /**
Create a new order from the user's cart.
@param {number} userId - The ID of the user creating the order.
@returns {Promise<object>} - The created order.
@throws {NotFoundException} - If the user's cart is not found.
@throws {ConflictException} - If any product in the cart is not available in the required quantity.
*/
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
