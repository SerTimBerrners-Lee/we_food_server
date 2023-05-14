import { Module } from '@nestjs/common';
import { StageService } from './stage.service';
import { StageController } from './stage.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Stage } from './stage.model';
import { StageDishes } from './stage-dishes.motel';

@Module({
  providers: [StageService],
  controllers: [StageController],
  imports: [
    SequelizeModule.forFeature([Stage, StageDishes]),
  ],
  exports: [
    StageService
  ]
})
export class StageModule {}
