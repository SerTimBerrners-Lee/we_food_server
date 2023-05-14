import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './order.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [
    SequelizeModule.forFeature([Order]),
  ],

  exports: [OrderService]
})
export class OrderModule {}
