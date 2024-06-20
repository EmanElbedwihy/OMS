import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartDto, CartItemDto } from './dto/get-cart-dto';

@ApiTags('Carts')
@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}
  // -------------------------------------add product-----------------------------------------
  @ApiOperation({ summary: 'Add a product to the cart' })
  @ApiBody({ type: CreateCartDto })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully added to the cart.',
    type: CartItemDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 404, description: 'User or Product not found.' })
  @ApiResponse({ status: 409, description: 'Product is not available' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Post('/add')
  async addProduct(@Body(new ValidationPipe()) createCartDto: CreateCartDto) {
    return this.cartsService.addProduct(createCartDto);
  }
  // -------------------------------------get cart-----------------------------------------
  @ApiOperation({ summary: 'Get the cart of a user' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully retrieved.',
    type: CartDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Get(':userId')
  async getCart(@Param('userId', new ParseIntPipe()) userId: number) {
    return this.cartsService.getCart(userId);
  }
  // -------------------------------------remove product--------------------------------------
  @ApiOperation({ summary: 'Remove a product from the cart' })
  @ApiQuery({ name: 'userId', type: Number })
  @ApiQuery({
    name: 'productId',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully removed from the cart.',
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 404, description: 'User or Product not found .' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Delete('/remove')
  async remove(
    @Query('userId', new ParseIntPipe()) userId: number,
    @Query('productId', new ParseIntPipe()) productId: number,
  ) {
    return this.cartsService.removeProduct(userId, productId);
  }
  // -------------------------------------update cart-----------------------------------------
  @ApiOperation({ summary: 'Update the cart' })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({
    status: 200,
    description: 'The cart has been successfully updated.',
    type: CartItemDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 404, description: 'User or Product not found .' })
  @ApiResponse({
    status: 409,
    description: 'Product is not available in the required quantity.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Put('/update')
  async updateCart(@Body(new ValidationPipe()) updateCartDto: UpdateCartDto) {
    return this.cartsService.updateCart(updateCartDto);
  }
}
