import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Get a greeting message' })
  @ApiOkResponse({ description: 'Successfully retrieved greeting message.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
