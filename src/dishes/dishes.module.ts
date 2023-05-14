import { Module } from '@nestjs/common';
import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';
import { Dishes } from './dishes.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [DishesController],
  providers: [DishesService],
  imports: [
    SequelizeModule.forFeature([Dishes])
  ],
})
export class DishesModule {}
