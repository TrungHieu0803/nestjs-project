import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { NotificationDto } from './dto/notifications.dto';
import { NotificationsEntity } from './notifications.entity';
import { NotificationTemplate } from './template/notifications.template';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectRepository(NotificationsEntity) private notificationRepo: Repository<NotificationsEntity>,
    ) { }

    async followNotification(fromUser: UserEntity, toUser: UserEntity): Promise<NotificationDto> {
        return this.notificationRepo.save(this.newNotificationEntity(fromUser, toUser, NotificationTemplate.followedByOtherUsers(fromUser)));
    }

    async tagNotification(fromUser: UserEntity, toUser: UserEntity): Promise<NotificationDto> {
        return this.notificationRepo.save(this.newNotificationEntity(fromUser, toUser, NotificationTemplate.tagNotificationTemplate(fromUser)));
    }

    async getTop5(toUserId: number): Promise<any> {
        try {
            const result = await this.notificationRepo.createQueryBuilder('n')
                .innerJoinAndSelect('n.fromUser', 'u')
                .select(['n.id AS id',
                    'n.is_read AS isRead',
                    'n.content AS content',
                    'n.created_date AS createdDate',
                    'u.id AS userId',
                    'u.fullName AS fullName',
                    'u.avatar AS avatar'])
                .where('n.toUserId = :id', { id: 10 })
                .orderBy('created_date', 'DESC')
                .take(5).execute();
            return result;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    private newNotificationEntity(fromUser: UserEntity, toUser: UserEntity, template: string): NotificationsEntity {
        const notificationEntity = new NotificationsEntity();
        notificationEntity.content = template;
        notificationEntity.isRead = false;
        notificationEntity.createdDate = new Date();
        notificationEntity.fromUser = fromUser;
        notificationEntity.toUser = toUser;
        return notificationEntity;
    }

}
