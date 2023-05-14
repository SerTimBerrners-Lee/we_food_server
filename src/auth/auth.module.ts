import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
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
