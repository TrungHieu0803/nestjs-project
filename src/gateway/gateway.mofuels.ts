import { Module } from "@nestjs/common";
import { FollowingRelationshipsModule } from "src/modules/following-relationships/following-relationships.module";
import { NotificationsModule } from "src/modules/notifications/notifications.module";
import { AppGateway } from "./app.gateway";



@Module({
    imports: [NotificationsModule, FollowingRelationshipsModule],
    providers: [AppGateway],
    controllers: [],
  })
  export class GatewayModules {}