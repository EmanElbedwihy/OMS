import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // -------------------------------------get order history---------------------------------
  @ApiOperation({ summary: 'Get order history of a user' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The order history has been successfully retrieved.',
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CreateOrderDtoRes',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Get(':userId/orders')
  async getOrders(@Param('userId', new ParseIntPipe()) userId: number) {
    return this.usersService.getOrders(userId);
  }
}
