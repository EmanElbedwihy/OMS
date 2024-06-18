import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
@Module({
  imports: [ CartsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
