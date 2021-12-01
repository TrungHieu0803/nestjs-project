
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';



@Module({
  imports: [
    JwtModule.register({
      secret:'demo-project',
      signOptions:{expiresIn:'3600s'}
    }),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [ AuthService, JwtModule],
})
export class AuthModule {}