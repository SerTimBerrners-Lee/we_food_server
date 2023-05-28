import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bid } from './bid.model';

@Module({
  providers: [BidService],
  controllers: [BidController],
  imports: [
    SequelizeModule.forFeature([
      Bid
    ])
  ]
})
export class BidModule {}
