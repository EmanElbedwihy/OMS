/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllData() {
  try {
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.coupon.deleteMany({});

    console.log('All data deleted successfully.');
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}
async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
      address: '123 Main St',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
      password: 'password123',
      address: '456 Oak St',
    },
  });

  // Create Products
  const product1 = await prisma.product.create({
    data: {
      name: 'Product 1',
      description: 'Description for product 1',
      price: 10.0,
      stock: 100,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Product 2',
      description: 'Description for product 2',
      price: 20.0,
      stock: 200,
    },
  });

  // Create Orders
  const order1 = await prisma.order.create({
    data: {
      orderDate: new Date(),
      status: 'Pending',
      userId: user1.userId,
      total: 20.0,
      orderItems: {
        create: [
          {
            productId: product1.productId,
            quantity: 2,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderDate: new Date(),
      status: 'Pending',
      userId: user2.userId,
      total: 60.0,
      orderItems: {
        create: [
          {
            productId: product2.productId,
            quantity: 3,
          },
        ],
      },
    },
  });

  // Create Cart Items
  await prisma.cart.create({
    data: {
      userId: user1.userId,
      cartItems: {
        create: [
          {
            productId: product1.productId,
            quantity: 2,
          },
        ],
      },
      total: 20.0,
    },
  });

  await prisma.cart.create({
    data: {
      userId: user2.userId,
      cartItems: {
        create: [
          {
            productId: product2.productId,
            quantity: 3,
          },
        ],
      },
      total: 60.0,
    },
  });

  // Create Coupons
  await prisma.coupon.create({
    data: {
      code: 'Summer24',
      discount: 25,
      expiration: new Date(2024, 7, 24, 0, 0, 0, 0),
    },
  });
  await prisma.coupon.create({
    data: {
      code: 'Winter25',
      discount: 50,
      expiration: new Date(2025, 2, 2, 0, 0, 0, 0),
    },
  });

  console.log('Seed data created');
}

deleteAllData();
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
