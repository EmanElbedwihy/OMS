import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Adds a product to the cart of a specific user.
   * @param {CreateCartDto} createCartDto - Data Transfer Object containing userId and productId.
   * @returns {Promise<object>} - The updated cart item.
   * @throws {NotFoundException} - If the user or product is not found.
   * @throws {ConflictException} - If the product is not available.
   */
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

  /**
   * Removes a product from the cart of a specific user.
   * @param {number} userId - The ID of the user.
   * @param {number} productId - The ID of the product to remove.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the user, product, or product in cart is not found.
   */
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

  /**
   * Retrieves the cart of a specific user.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<object>} - The cart details including items.
   * @throws {NotFoundException} - If the user's cart is not found.
   */
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

  /**
   * Updates the quantity of a product in the cart of a specific user.
   * @param {UpdateCartDto} updateCartDto - Data Transfer Object containing userId, productId, and quantity.
   * @returns {Promise<object>} - The updated cart item.
   * @throws {NotFoundException} - If the user, product, or product in cart is not found.
   * @throws {ConflictException} - If the product is not available in the required quantity.
   */
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
