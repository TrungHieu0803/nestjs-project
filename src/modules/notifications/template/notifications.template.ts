import { UserEntity } from "src/modules/users/users.entity";


export class NotificationTemplate implements Readonly<NotificationTemplate> {

    public static followedByOtherUsers(fromUser: UserEntity): string {
        return fromUser.fullName + ' is following you now'
    }

    public static tagNotificationTemplate(fromUser: UserEntity): string {
        return `${fromUser.fullName} tagged you in a post`
    }
}