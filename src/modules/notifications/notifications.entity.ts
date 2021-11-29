import { UserEntity } from "src/modules/users/users.entity";
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";


@Entity()
export class NotificationsEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column("nvarchar")
    content:string

    @Column("nvarchar")
    link:string

    @ManyToOne(type=> UserEntity,user=>user.notifications)
    user : UserEntity;
}
