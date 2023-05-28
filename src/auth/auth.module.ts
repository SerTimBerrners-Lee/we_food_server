import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthCode } from './auth-code.model';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    SequelizeModule.forFeature([AuthCode]),
    
    UserModule,
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
