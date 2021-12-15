import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { NotificationDto } from './dto/notifications.dto';
import { NotificationsEntity } from './notifications.entity';
import { NotificationTemplate } from './template/notifications.template';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectRepository(NotificationsEntity) private notificationRepo: Repository<NotificationsEntity>,
        @Inject(forwardRef(() => UsersService)) private userService: UsersService
    ) { }

    async addNotification(fromUser: UserEntity, toUser: UserEntity): Promise<NotificationDto> {
        const notificationEntity = new NotificationsEntity();
        notificationEntity.content = NotificationTemplate.followedByOtherUsers(fromUser);
        notificationEntity.isRead = false;
        notificationEntity.createdDate = new Date();
        notificationEntity.fromUser = fromUser;
        notificationEntity.toUser = toUser;
        return this.notificationRepo.save(notificationEntity);
    }

    async getTop5(): Promise<any> {
        try {
            const result = await this.notificationRepo.createQueryBuilder()
                .select().orderBy('created_date', 'DESC').take(5).execute();
            return result;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

    }

}
