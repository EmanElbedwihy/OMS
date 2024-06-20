import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    description: 'The status of the order',
    example: 'Delivering',
  })
  @IsString()
  @IsEnum(['Pending', 'Delivering', 'Delivered', 'Canceled'], {
    message: 'status must be:Pending , Delivering , Delivered , Canceled',
  })
  status: string;
}
