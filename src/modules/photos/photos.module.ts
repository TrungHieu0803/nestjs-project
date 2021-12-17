import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { PhotosEntity } from './photos.entity';
import { PhotosService } from './photos.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([PhotosEntity])],
  providers: [PhotosService],
  exports: [PhotosService]
})
export class PhotosModule { }
