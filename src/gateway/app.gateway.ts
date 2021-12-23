import { forwardRef, Inject, Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { FollowingRelationshipsService } from "src/modules/following-relationships/following-relationships.service";
import { NotificationInterface } from "./interfaces/notification.interface";


@WebSocketGateway(3005, { cors: true })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(forwardRef(() => FollowingRelationshipsService)) private followService: FollowingRelationshipsService
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
            try {
                this.followService.follow({ followedUserId: payload.toUserId }, payload.fromUserId)
                this.server.emit(`notification-${payload.toUserId}`,{success: 'true'})
            } catch (error) {

            }
        }

    }
}