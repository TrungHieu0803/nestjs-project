import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PhotosModule } from './modules/photos/photos.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { ConversationReplyModule } from './modules/conversation-reply/conversation-reply.module';
import { PostsModule } from './modules/posts/posts.module';
import { PostCommentsModule } from './modules/post-comments/post-comments.module';
import { PostLikeModule } from './modules/post-like/post-like.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'web_app',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    NotificationsModule,
    PhotosModule,
    ConversationsModule,
    ConversationReplyModule,
    PostsModule,
    PostCommentsModule,
    PostLikeModule,
    
  ],
  controllers: [
    AppController
  ],
  providers: [AppService],
})
export class AppModule {}
