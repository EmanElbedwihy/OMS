import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all orders for a specific user.
   * @param {number} userId - The ID of the user whose orders are to be retrieved.
   * @returns {Promise<object[]>} - An array of orders associated with the user.
   * @throws {NotFoundException} - If the user is not found.
   */
  async getOrders(userId: number) {
    const user = await this.prisma.prismaClient.user.findUnique({
      where: { userId },
    });
    if (!user) throw new NotFoundException('User not found');
    return await this.prisma.prismaClient.order.findMany({
      where: { userId },
    });
  }
}
