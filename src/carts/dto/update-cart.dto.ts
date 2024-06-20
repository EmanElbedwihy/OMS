import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @ApiProperty({
    description: 'The ID of the user',
    example: 3,
  })
  @IsInt()
  userId: number;
  @ApiProperty({
    description: 'The ID of the product',
    example: 7,
  })
  @IsInt()
  productId: number;
  @ApiProperty({
    description: 'The quantity of the product',
    example: 3,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
