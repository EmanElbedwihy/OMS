import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCartDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: 3,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'The ID of the product',
    example: 5,
  })
  @IsInt()
  productId: number;
}
