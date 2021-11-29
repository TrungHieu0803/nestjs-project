import { PrimaryGeneratedColumn,Column,ManyToOne,OneToMany, Entity } from "typeorm";
import { UserEntity } from "src/modules/users/users.entity";
import { PostCommentsEntity } from "src/modules/post-comments/post-comments.entity";
import { PostLikeEntity } from "src/modules/post-like/post-like.entity";

@Entity()
export class PostsEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column("nvarchar")
    content :string

    @Column("int")
    status : number

    @Column("date")
    createdDate : Date

    @Column("int")
    share : number

    @ManyToOne(type=>UserEntity,user=>user.posts)
    user : UserEntity

    @OneToMany(type=>PostCommentsEntity,postcomment=>postcomment.post)
    postComments : PostCommentsEntity

    @OneToMany(type=>PostLikeEntity, postLike => postLike.post)
    postLikes : PostLikeEntity

}
