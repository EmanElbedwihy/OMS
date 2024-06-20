import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateOrderDto {
  @ApiProperty({
    description: 'The ID of the order',
    example: 5,
  })
  @IsInt()
  orderId: number;
  @ApiProperty({
    description: 'The code of the coupon',
    example: 'Summer24',
  })
  @IsString()
  code: string;
}
