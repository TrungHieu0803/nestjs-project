import { Module } from "@nestjs/common";
import { FollowingRelationshipsModule } from "src/modules/following-relationships/following-relationships.module";
import { NotificationsModule } from "src/modules/notifications/notifications.module";
import { PostCommentsModule } from "src/modules/post-comments/post-comments.module";
import { PostLikeModule } from "src/modules/post-like/post-like.module";
import { AppGateway } from "./app.gateway";



@Module({
    imports: [NotificationsModule, FollowingRelationshipsModule, PostLikeModule, NotificationsModule, PostCommentsModule],
    providers: [AppGateway],
    controllers: [],
  })
  export class GatewayModules {}