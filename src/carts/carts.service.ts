import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(private readonly prisma: PrismaService) {}

  async addProduct(createCartDto: CreateCartDto) {
    const cart = await this.prisma.prismaClient.cart.findFirst({
      where: { userId: createCartDto.userId },
      select: { cartId: true, total: true },
    });

    if (!cart) throw new NotFoundException('User not found');

    const product = await this.prisma.prismaClient.product.findUnique({
      where: { productId: createCartDto.productId },
      select: { price: true, stock: true },
    });

    if (!product) throw new NotFoundException('Product not found');
    else if (product.stock == 0)
      throw new ConflictException('Product is not available');
    else {
      await this.prisma.prismaClient.cart.update({
        where: {
          cartId: cart.cartId,
        },
        data: { total: cart.total + product.price },
      });
    }

    const cartItem = await this.prisma.prismaClient.cartItem.findFirst({
      where: { cartId: cart.cartId, productId: createCartDto.productId },
    });

    if (cartItem) {
      return await this.prisma.prismaClient.cartItem.update({
        where: {
          cartId_productId: {
            cartId: cart.cartId,
            productId: createCartDto.productId,
          },
        },
        data: { quantity: cartItem.quantity + 1 },
      });
    } else {
      return await this.prisma.prismaClient.cartItem.create({
        data: {
          cartId: cart.cartId,
          productId: createCartDto.productId,
          quantity: 1,
        },
      });
    }
  }

  async removeProduct(userId: number, productId: number) {
    const cart = await this.prisma.prismaClient.cart.findFirst({
      where: { userId },
      select: { cartId: true, total: true },
    });
    if (!cart) throw new NotFoundException('User not found');

    const product = await this.prisma.prismaClient.product.findUnique({
      where: { productId },
      select: { price: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    const cartItem = await this.prisma.prismaClient.cartItem.findFirst({
      where: { cartId: cart.cartId, productId },
    });
    if (!cartItem) throw new NotFoundException('Product not found in the cart');
    else {
      await this.prisma.prismaClient.cart.update({
        where: {
          cartId: cart.cartId,
        },
        data: { total: cart.total - product.price * cartItem.quantity },
      });

      await this.prisma.prismaClient.cartItem.delete({
        where: {
          cartId_productId: {
            cartId: cart.cartId,
            productId,
          },
        },
      });
    }
  }

  async getCart(userId: number) {
    const cart = await this.prisma.prismaClient.cart.findFirst({
      where: { userId },
      include: {
        cartItems: {
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
    if (!cart) throw new NotFoundException('User not found');
    else return cart;
  }

  async updateCart(updateCartDto: UpdateCartDto) {
    const cart = await this.prisma.prismaClient.cart.findFirst({
      where: { userId: updateCartDto.userId },
      select: { cartId: true, total: true },
    });
    if (!cart) throw new NotFoundException('User not found');

    const product = await this.prisma.prismaClient.product.findUnique({
      where: { productId: updateCartDto.productId },
      select: { price: true, stock: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    const cartItem = await this.prisma.prismaClient.cartItem.findFirst({
      where: { cartId: cart.cartId, productId: updateCartDto.productId },
    });
    if (!cartItem) throw new NotFoundException('Product not found in the cart');
    if (updateCartDto.quantity - cartItem.quantity > product.stock)
      throw new ConflictException(
        'Product is not available in the required quantity',
      );
    await this.prisma.prismaClient.cart.update({
      where: {
        cartId: cart.cartId,
      },
      data: {
        total:
          cart.total -
          cartItem.quantity * product.price +
          updateCartDto.quantity * product.price,
      },
    });

    return await this.prisma.prismaClient.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.cartId,
          productId: updateCartDto.productId,
        },
      },
      data: { quantity: updateCartDto.quantity },
    });
  }
}
