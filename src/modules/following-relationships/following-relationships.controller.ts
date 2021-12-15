import { Body, Controller, Delete, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { FollowDto } from './dto/follow.dto';
import { FollowingRelationshipsService } from './following-relationships.service';

@Controller('following-relationships')
export class FollowingRelationshipsController {

    constructor(
        private readonly followingRelationShipsService: FollowingRelationshipsService
    ) { }

    @Post('follow')
    @ApiBearerAuth()
    @ApiResponse({ status: 201, schema: { example: { status: 201, message: 'Followed user have id 1' } } })
    @ApiResponse({ status: 400, schema: { example: { status: 400, message: 'Already followed user have id 1', error: 'Bad request' } } })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'error description', error: 'Internal server' } } })
    follow(@Body() followDto: FollowDto, @Request() req): Promise<any> {
        return this.followingRelationShipsService.follow(followDto, parseInt(req.headers.id));
    }

    @Delete('unfollow')
    @ApiBearerAuth()
    @ApiResponse({ status: 201, schema: { example: { status: 201, message: 'Unfollowed user have id 1' } } })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'error description', error: 'Internal server' } } })
    unfollow(@Body() followDto: FollowDto, @Request() req): Promise<any> {
        return this.followingRelationShipsService.unfollow(followDto, parseInt(req.headers.id));
    }

}
