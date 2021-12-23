import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotosService } from '../photos/photos.service';
import { TagsService } from '../tags/tags.service';
import { UsersService } from '../users/users.service';
import { PostsDto } from './dto/posts.dto';
import { PostsEntity } from './posts.entity';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { FollowingRelationshipsService } from '../following-relationships/following-relationships.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsEntity) private postRepo: Repository<PostsEntity>,
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
        @Inject(forwardRef(() => PhotosService)) private photosService: PhotosService,
        @Inject(forwardRef(() => TagsService)) private tagsService: TagsService,
        @Inject(forwardRef(() => FollowingRelationshipsService)) private followingService: FollowingRelationshipsService,
    ) { }

    async createNewPost(files: Array<Express.Multer.File>, postsDto: PostsDto, userId: number) {
        let postsEntity = new PostsEntity();
        postsEntity.content = postsDto.content;
        postsEntity.user = await this.userService.findOne(userId);
        postsEntity.createdDate = new Date();
        postsEntity.status = 1;
        const result = await this.postRepo.save(postsEntity);
        this.photosService.uploadPhoto(files, result);  //upload photos
        this.tagsService.addTags(postsDto.tags, result, postsEntity.user); //add tag
        return { message: 'Post created' }
    }

    async paginate(options: IPaginationOptions, userId: number): Promise<Pagination<PostsEntity>> {
        const listFollow = (await this.followingService.getFollowedUser(userId)).map((follow) => {
            return follow.followedUserId;
        });
        const get5DayBefore = this.getNDayBefore(5);
        const result = this.postRepo.createQueryBuilder().select()
            .where('userId IN (:...ids)', { ids: listFollow })
            .andWhere('createdDate > :date', { date: get5DayBefore }).orderBy('createdDate', 'DESC');
        return paginate<PostsEntity>(result, options);
    }

    async findOne(postId: number): Promise<PostsEntity> {
        const result = await this.findOne(postId);
        if (!result) {
            throw new NotFoundException('Post does not exist!')
        }
        return result;
    }

    getNDayBefore(n: number): Date {
        var date = new Date();
        date.setDate(date.getDay() - n);
        return date;
    }


}
