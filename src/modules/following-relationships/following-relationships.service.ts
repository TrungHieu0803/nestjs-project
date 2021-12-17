import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { UserEntity } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { FollowDto } from './dto/follow.dto';
import { FollowingRelationshipsEntity } from './following-relationships.entity';

@Injectable()
export class FollowingRelationshipsService {

    constructor(
        @InjectRepository(FollowingRelationshipsEntity) private repo: Repository<FollowingRelationshipsEntity>,
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
        @Inject(forwardRef(() => NotificationsService)) private notificationsService: NotificationsService
    ) { }

    async follow(followDto: FollowDto, userId: number): Promise<any> {
        const isExist = await this.repo.createQueryBuilder().select()
            .where("followedUserId = :followedUserId AND followerId = :followerId",
                { followedUserId: followDto.followedUserId, followerId: userId }).execute();
        if (isExist.length) {
            throw new BadRequestException('Already followed user have id ' + followDto.followedUserId);
        }
        const entity = new FollowingRelationshipsEntity();
        entity.dateFollowed = new Date();
        try {
            entity.follower = await this.userService.findOne(userId);
            entity.followedUser = await this.userService.findOne(followDto.followedUserId);
            this.repo.save(entity);
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
        //create notification 
        await this.notificationsService.followNotification(entity.follower, entity.followedUser);
        return {
            status: 201,
            message: 'Followed user have id ' + followDto.followedUserId
        };
    }

    async unfollow(followDto: FollowDto, userId: number): Promise<any> {
        try {
            this.repo.createQueryBuilder().delete().where("followedUserId = :followedUserId AND followerId = :followerId",
                { followedUserId: followDto.followedUserId, followerId: userId }).execute();
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
        return {
            status: 201,
            message: 'Unfollowed user have id ' + followDto.followedUserId
        }
    }

    async getFollowedUser(userId: number): Promise<FollowDto[]> {
        return await this.repo.createQueryBuilder().select(['followedUserId']).where('followerId = :id', { id: userId }).execute();
    }
}
