import { Module } from '@nestjs/common';
import { KitchenService } from './kitchen.service';
import { KitchenController } from './kitchen.controller';
import { OrderModule } from 'src/order/order.module';
import { StageModule } from 'src/stage/stage.module';

@Module({
  providers: [KitchenService],
  controllers: [KitchenController],
  imports: [
    OrderModule,
    StageModule
  ],
})
export class KitchenModule {}
