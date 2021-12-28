import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { PostCommentsService } from './post-comments.service';

@Controller('post-comments')
export class PostCommentsController {

    constructor(
        private postCommentService: PostCommentsService
    ) { }


    @Get('get-comment/:postId')
    @ApiOkResponse({schema: {example: {data: 'List of comment'}}})
    @ApiResponse({status: 404, description: 'Not found', schema: {example: {status: 404, message: 'No comment', error: 404}}})
    getComment(@Param('postId') postId: number): Promise<any> {
        return this.postCommentService.getComments(postId);
    }
}
