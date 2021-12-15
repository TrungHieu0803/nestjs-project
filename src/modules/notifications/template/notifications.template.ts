import { UserEntity } from "src/modules/users/users.entity";


export class NotificationTemplate implements Readonly<NotificationTemplate> {

    public static followedByOtherUsers(fromUser: UserEntity): string{
        return fromUser.fullName+' is following you now'
    }
}