import { UserEntity } from "src/modules/users/users.entity";
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from "typeorm";

@Entity()
export class PhotosEntity {
    @PrimaryGeneratedColumn()
    id : number

    @Column({name:'photo_name',type:'varchar'})
    photoName:string

    @ManyToOne(type=>UserEntity,user=>user.photos)
    user:UserEntity


}
