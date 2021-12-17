import { Body, Controller, Post, UploadedFiles, UseInterceptors, Request, DefaultValuePipe, ParseIntPipe, Query, Get } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PostsDto } from './dto/posts.dto';
import { PostsEntity } from './posts.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {

    constructor(
        private postsService: PostsService,
    ) { }

    @Post('create-post')
    @ApiBearerAuth()
    @ApiOkResponse({ schema: { example: { 'message': 'Post created' } } })
    @ApiResponse({ status: 400, schema: { example: { 'status': 400, 'message': 'Format error: Not a file .jpeg', 'error': 'Bad request' } } })
    @ApiResponse({ status: 500, schema: { example: { 'status': 500, 'message': 'Something blow up with our code', 'error': 'Internal server' } } })
    @ApiConsumes('multipart/form-data', 'application/json')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary'
                    }
                }
            },
        },
    })
    @UseInterceptors(AnyFilesInterceptor())
    createPost(@UploadedFiles() files: Array<Express.Multer.File>, @Body() post: PostsDto, @Request() req) {
        return this.postsService.createNewPost(files, post, parseInt(req.headers.id));
    }

    @Get('get-posts')
    @ApiBearerAuth()
    getPosts(@Request() req, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,): Promise<Pagination<PostsEntity>> {
        limit = limit > 20 ? 20 : limit;
        return this.postsService.paginate({ page, limit, route: 'localhost:3000/posts/get-posts' }, req.headers.id);

    }
}
