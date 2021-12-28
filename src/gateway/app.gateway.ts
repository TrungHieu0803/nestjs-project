import { forwardRef, Inject, Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { FollowingRelationshipsService } from "src/modules/following-relationships/following-relationships.service";
import { NotificationsService } from "src/modules/notifications/notifications.service";
import { PostCommentsService } from "src/modules/post-comments/post-comments.service";
import { PostLikeService } from "src/modules/post-like/post-like.service";
import { NotificationInterface } from "./interfaces/notification.interface";


@WebSocketGateway(3005, { cors: true })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(forwardRef(() => FollowingRelationshipsService)) private followService: FollowingRelationshipsService,
        @Inject(forwardRef(() => PostLikeService)) private postLikeService: PostLikeService,
        @Inject(forwardRef(() => PostCommentsService)) private postCommentService: PostCommentsService,

    ) { }
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('MessageGateway');

    handleConnection(client: any, ...args: any[]) {
        this.logger.log(client.id, 'Connected');
    }
    handleDisconnect(client: any) {
        this.logger.log(client.id, 'Disconnect');
    }
    afterInit(server: any) {
        this.logger.log(server, 'Init');
    }

    @SubscribeMessage('notification')
    async notification(client: Socket, payload: NotificationInterface) {
        if (payload.type === 1) {
            this.followService.follow({ followedUserId: payload.toUserId }, payload.fromUserId);
            this.server.emit(`notification-follow-${payload.toUserId}`, { success: 'true' });
        } else if (payload.type == 2) {
            this.postLikeService.addLike(payload.postId, payload.fromUserId, payload.toUserId);
            this.server.emit(`notification-like-${payload.toUserId}`, {success: 'true'});
        } else if(payload.type == 3){
            this.postCommentService.addComment(payload.fromUserId, payload.toUserId, payload.postId, payload.comment, payload.replyForComment);
            this.server.emit(`notification-comment-${payload.toUserId}`,{success: 'true'});
        }

    }
}