import { ApiProperty } from "@nestjs/swagger";


export class FollowDto{

    @ApiProperty({type: Number, description: 'Followed user id'})
    followedUserId: number;

}