import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateOrderDto {
  @ApiProperty({
    description: 'The ID of the order',
    example: 5,
  })
  @IsInt()
  orderId: number;
  @ApiProperty({
    description: 'The discount to be applied to the order',
    example: 25,
  })
  @IsInt()
  @Min(1)
  discount: number;
}
