import { ApiProperty } from '@nestjs/swagger';

class ProductDto {
  @ApiProperty({ example: 'Product 1' })
  name: string;

  @ApiProperty({ example: 'Description for product 1' })
  description: string;

  @ApiProperty({ example: 10 })
  price: number;
}

class OrderItemDto {
  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ type: ProductDto })
  product: ProductDto;
}

export class GetOrderDto {
  @ApiProperty({ example: 1 })
  orderId: number;

  @ApiProperty({ example: '2024-06-19T20:05:08.093Z' })
  orderDate: string;

  @ApiProperty({ example: 'Delivered' })
  status: string;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 20 })
  total: number;

  @ApiProperty({ type: [OrderItemDto] })
  orderItems: OrderItemDto[];
}

export class CreateOrderDtoRes {
  @ApiProperty({ example: 1 })
  orderId: number;

  @ApiProperty({ example: '2024-06-19T20:05:08.093Z' })
  orderDate: string;

  @ApiProperty({ example: 'Delivered' })
  status: string;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 20 })
  total: number;
}
