/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';

class ProductDto {
  @ApiProperty({ example: 'Product 1' })
  name: string;

  @ApiProperty({ example: 'Description for product 1' })
  description: string;

  @ApiProperty({ example: 10 })
  price: number;
}

class CartItem {
  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({ example: 1 })
  quantity: number;

  @ApiProperty({ type: ProductDto })
  product: ProductDto;
}

export class CartDto {
  @ApiProperty({ example: 1 })
  cartId: number;

  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ type: [CartItem] })
  cartItems: CartItem[];
}

export class CartItemDto {
  @ApiProperty({ example: 3 })
  cartId: ProductDto;

  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({ example: 1 })
  quantity: number;
}
