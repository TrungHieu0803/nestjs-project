import { type } from "os";
import { text } from "stream/consumers";
import { Column, Entity, PrimaryGeneratedColumn ,OneToMany} from "typeorm";
import { NotificationsEntity } from "src/modules/notifications/notifications.entity";
import { NextNotification } from "rxjs";
import { PhotosEntity } from "src/modules/photos/photos.entity";
import { ConversationsEntity } from "src/modules/conversations/conversations.entity";
import { ConversationReplyEntity } from "src/modules/conversation-reply/conversation-reply.entity";
import { PostsEntity } from "src/modules/posts/posts.entity";
import { PostLikeEntity } from "src/modules/post-like/post-like.entity";
import { PostCommentsEntity } from "src/modules/post-comments/post-comments.entity";
@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"varchar",nullable:true})
    password : string

    @Column({type:"varchar",length:50,nullable:true})
    email : string

    @Column({type:"varchar",nullable:true})
    fullName : string

    @Column({type:'date',nullable:true})
    dob : Date

    @Column({type:"int",nullable:true})
    accountStatus : number

    @Column({type:"varchar",nullable:true})
    verificationCode : string

    @Column({type:"boolean",nullable:true})
    gender : boolean

    @Column({type:"varchar",nullable:true})
    address : string

    @Column({type:"varchar",length:12,nullable:true})
    phone : string

    

    @OneToMany(type=>NotificationsEntity,notifications=>notifications.user)
    notifications:NotificationsEntity

    @OneToMany(type=>PhotosEntity,photo=>photo.user)
    photos : PhotosEntity

    @OneToMany(type=>ConversationsEntity,conversation=>conversation.user1)
    conversationsUser1 : ConversationsEntity

    @OneToMany(type=>ConversationsEntity,conversation=>conversation.user2)
    conversationsUser2 : ConversationsEntity

    @OneToMany(type=>ConversationReplyEntity, conversationReply=>conversationReply.user)
    conversationReply : ConversationReplyEntity

    @OneToMany(type=>PostsEntity,post=>post.user)
    posts : PostsEntity

    @OneToMany(type=>PostLikeEntity,postLike=>postLike.user)
    postLikes : PostLikeEntity

    @OneToMany(type=>PostCommentsEntity,postComment => postComment.user)
    postComments : PostCommentsEntity

}
