
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';

import { AuthService } from './services/auth.service';

@Module({
  imports: [
    JwtModule.register(null),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [ AuthService, JwtModule],
})
export class AuthModule {}