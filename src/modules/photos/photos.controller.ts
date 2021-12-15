import { Controller, Post, UploadedFile, UseInterceptors ,Request} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiBearerAuth, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {

    constructor(private photoService : PhotosService){}

    @Post('upload')
    @ApiBearerAuth()
    @ApiOkResponse({schema:{example:{'message':'File uploaded'}}})
    @ApiResponse({status:400,schema:{example:{'status':400,'message':'Format error: Not a file .jpeg','error':'Bad request'}}})
    @ApiResponse({status:500,schema:{example:{'status':500,'message':'Server cannot process the file','error':'Internal server'}}})
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadPhoto(@UploadedFile('file') file, @Request() req) {    
        return this.photoService.uploadPhoto(file,parseInt(req.headers.id));
    }
}
