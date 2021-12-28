import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { PostCommentsDto, ReplyCommentDto } from './dto/post-comments.dto';
import { PostCommentsEntity } from './post-comments.entity';

@Injectable()
export class PostCommentsService {

    constructor(
        @InjectRepository(PostCommentsEntity) private postCommentRepo: Repository<PostCommentsEntity>,
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
        @Inject(forwardRef(() => PostsService)) private postService: PostsService,
        @Inject(forwardRef(() => NotificationsService)) private notificationService: NotificationsService,
    ) { }

    async addComment(fromUserId: number, toUserId: number, postId: number, comment: string, replyForComment: number): Promise<any>{
        const fromUser = await this.userService.findOne(fromUserId);
        const toUser = await this.userService.findOne(toUserId);
        const post = await this.postService.findOne(postId);
        const commentEntity = new PostCommentsEntity();
        commentEntity.content = comment;
        commentEntity.createdDate = new Date();
        commentEntity.user = fromUser;
        commentEntity.post = post;
        commentEntity.replyForComment = replyForComment;
        this.notificationService.commentNotification(fromUser, toUser);
        this.postCommentRepo.save(commentEntity);
        return {message: 'Comment created'}
    }

    async getComments(postId: number): Promise<any> {
        const allComment = await this.postCommentRepo.createQueryBuilder('c')
            .innerJoinAndSelect('c.user', 'userInfo')
            .select([
                'c.id AS id',
                'c.content AS content',
                'c.createdDate AS createdDate',
                'c.reply_for_comment AS replyForComment',
                'userInfo.id AS userId',
                'userInfo.fullName AS fullName',
                'userInfo.avatar AS avatar'
            ])
            .where('postId = :postId', { postId: postId })
            .andWhere('c.reply_for_comment IS NULL')
            .execute();
        if(allComment.length == 0){
            throw new NotFoundException('No comment')
        }
        const result = [];
        for(const comment of allComment){
            const commentAndReplyComment = new PostCommentsDto();
            const replyComments = await this.postCommentRepo.createQueryBuilder('c')
                .innerJoinAndSelect('c.user', 'userInfo')
                .select([
                    'c.id AS id',
                    'c.content AS content',
                    'c.createdDate AS createdDate',
                    'userInfo.id AS userId',
                    'userInfo.fullName AS fullName',
                    'userInfo.avatar AS avatar'
                ])
                .andWhere('c.reply_for_comment = :id', { id: comment.id })
                .execute();
                
            const replyCommentsDto = replyComments.map((rc) => {
                const result = new ReplyCommentDto();
                result.commentId = rc.id;
                result.content = rc.content;
                result.createdDate = rc.createdDate;
                result.user = { userId: rc.userId, fullName: rc.fullName, avatar: rc.avatar }
                return result;
            });
           
            commentAndReplyComment.commentId = comment.id;
            commentAndReplyComment.content = comment.content;
            commentAndReplyComment.createdDate = comment.createdDate;
            commentAndReplyComment.user ={ userId: comment.userId, fullName: comment.fullName, avatar: comment.avatar}
            commentAndReplyComment.replyComment = replyCommentsDto;
            result.push(commentAndReplyComment)
        }
    
        return result;
    }
}
