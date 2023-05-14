import { Module } from '@nestjs/common';
import { ProductLineService } from './product_line.service';
import { ProductLineController } from './product_line.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductLine } from './product_line.model';

@Module({
  providers: [ProductLineService],
  controllers: [ProductLineController],
  imports: [
    SequelizeModule.forFeature([ProductLine])
  ],

  exports: [ProductLineService]
})
export class ProductLineModule {}
