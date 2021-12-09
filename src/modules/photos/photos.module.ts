import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { PhotosController } from './photos.controller';
import { PhotosEntity } from './photos.entity';
import { PhotosService } from './photos.service';

@Module({
  imports:[JwtModule.register(null),UsersModule,TypeOrmModule.forFeature([PhotosEntity])],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports:[JwtModule]
})
export class PhotosModule {}
