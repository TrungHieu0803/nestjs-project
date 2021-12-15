import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PhotosEntity } from './photos.entity';

@Injectable()
export class PhotosService {
    constructor(@InjectRepository(PhotosEntity) private photosRepository: Repository<PhotosEntity>,
                @Inject(forwardRef(() => UsersService)) private userService: UsersService){}

    async addPhoto(photo : PhotosEntity) : Promise<PhotosEntity>{
        return this.photosRepository.save(photo)
    }

    async uploadPhoto(file: Express.Multer.File, id: number) {
        const fileTypes = ["image/jpeg", "image/png"];
        const {originalname,mimetype,buffer} = file
        if(!fileTypes.includes(mimetype)){
            throw new BadRequestException('Format error: Not a file .jpeg')
        }
        //save to database
        const photo = new PhotosEntity()
        photo.photoName = originalname
        photo.user = await this.userService.findOne(id)
        this.addPhoto(photo)
        //save to firebase
        const bucket = admin.storage().bucket()
        const blob = bucket.file(originalname)
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: mimetype
            }
        })
        blobWriter.on('error', (err) => {
            throw new InternalServerErrorException('Server cannot process the file')
        })
        blobWriter.end(buffer)
        return {'message':'File uploaded'}
    }
}
