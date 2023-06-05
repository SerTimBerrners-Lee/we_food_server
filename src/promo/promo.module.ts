import { Module } from '@nestjs/common';
import { PromoService } from './promo.service';
import { PromoController } from './promo.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Promo } from './promo.model';

@Module({
  providers: [PromoService],
  controllers: [PromoController],
  imports: [
    SequelizeModule.forFeature([
      Promo
    ])
  ],
  exports: [PromoService]
})
export class PromoModule {}
