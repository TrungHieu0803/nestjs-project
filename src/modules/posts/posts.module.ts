import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowingRelationshipsModule } from '../following-relationships/following-relationships.module';
import { PhotosModule } from '../photos/photos.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { PostsController } from './posts.controller';
import { PostsEntity } from './posts.entity';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostsEntity]), PhotosModule, UsersModule, TagsModule, FollowingRelationshipsModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule { }
