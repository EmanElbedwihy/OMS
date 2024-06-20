import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Post,
  Query,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrderDto, CreateOrderDtoRes } from './dto/get-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  // -------------------------------------get order-----------------------------------------
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'orderId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully retrieved.',
    type: GetOrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({
    status: 400,
    description: 'Validation failed (numeric string is expected).',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Get(':orderId')
  async getOrder(@Param('orderId', new ParseIntPipe()) orderId: number) {
    return this.ordersService.getOrder(orderId);
  }
  // -------------------------------------create order-----------------------------------------
  @ApiOperation({ summary: 'Create a new order' })
  @ApiQuery({ name: 'userId', type: Number })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    type: CreateOrderDtoRes,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({
    status: 400,
    description: 'Validation failed (numeric string is expected).',
  })
  @ApiResponse({
    status: 409,
    description: 'Product is not available in the required quantity.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Post()
  async createOrder(@Query('userId', new ParseIntPipe()) userId: number) {
    return this.ordersService.createOrder(userId);
  }
  // -------------------------------------apply coupon-----------------------------------------
  @ApiOperation({ summary: 'Apply a coupon to an order' })
  @ApiBody({
    type: CreateOrderDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The coupon has been successfully applied.',
    type: CreateOrderDtoRes,
  })
  @ApiResponse({ status: 404, description: 'Order or Coupon not found.' })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })
  @ApiResponse({ status: 410, description: 'Coupon expired.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Post('/apply-coupon')
  async appplyCoupon(
    @Body(new ValidationPipe()) createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.applyCoupon(createOrderDto);
  }
  // -------------------------------------update status-----------------------------------------
  @ApiOperation({ summary: 'Update the status of an order' })
  @ApiParam({ name: 'orderId', type: Number })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: 200,
    description: 'The order status has been successfully updated.',
    type: CreateOrderDtoRes,
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({
    status: 409,
    description: 'Order status is already the same.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId', new ParseIntPipe()) id: number,
    @Body(new ValidationPipe()) updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderDto);
  }
}
