import { UserEntity } from "src/modules/users/users.entity";
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from "typeorm";

@Entity()
export class PhotosEntity {
    @PrimaryGeneratedColumn()
    id : number

    @Column("nvarchar")
    photo:string

    @ManyToOne(type=>UserEntity,user=>user.photos)
    user:UserEntity


}
