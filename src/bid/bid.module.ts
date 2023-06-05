import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bid } from './bid.model';
import { MailModule } from 'src/mail/mail.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [BidService],
  controllers: [BidController],
  imports: [
    SequelizeModule.forFeature([
      Bid,
    ]),
    UserModule,
    MailModule
  ]
})
export class BidModule {}
