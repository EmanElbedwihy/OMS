import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
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
