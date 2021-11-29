import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/modules/users/users.entity";
import { PostsEntity } from "src/modules/posts/posts.entity";

@Entity()
export class PostCommentsEntity {
    @PrimaryGeneratedColumn()
    id : number

    @Column("nvarchar")
    content : string

    @Column("date")
    createdDate : Date

    @ManyToMany(type=>PostsEntity,post=>post.postComments)
    post : PostsEntity

    @ManyToMany(type=>UserEntity, user => user.postComments)
    user : UserEntity

}
