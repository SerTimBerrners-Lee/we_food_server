import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthCode } from './auth-code.model';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    SequelizeModule.forFeature([AuthCode]),
    
    UserModule,
    SmsModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '24h'
      }
    }),
  ],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
