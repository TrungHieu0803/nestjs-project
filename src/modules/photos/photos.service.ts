import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { Repository } from 'typeorm';
import { PostsEntity } from '../posts/posts.entity';
import { UsersService } from '../users/users.service';
import { PhotosEntity } from './photos.entity';

@Injectable()
export class PhotosService {
    constructor(@InjectRepository(PhotosEntity) private photosRepository: Repository<PhotosEntity>,
        @Inject(forwardRef(() => UsersService)) private userService: UsersService) { }

    async addPhoto(photo: PhotosEntity): Promise<PhotosEntity> {
        return this.photosRepository.save(photo)
    }

    async uploadPhoto(files: Array<Express.Multer.File>, postsEntity: PostsEntity) {
        files.forEach((file) => {
            const fileTypes = ["image/jpeg", "image/png"];
            const { originalname, mimetype, buffer } = file
            if (!fileTypes.includes(mimetype)) {
                throw new BadRequestException('Format error: Not an image')
            }
            //save to db
            let photosEntity = new PhotosEntity();
            photosEntity.photoName = originalname;
            photosEntity.post = postsEntity;
            this.photosRepository.save(photosEntity);
            //save to firebase
            const bucket = admin.storage().bucket()
            const blob = bucket.file(originalname)
            const blobWriter = blob.createWriteStream({
                metadata: {
                    contentType: mimetype
                }
            })
            blobWriter.on('error', (err) => {
                throw new InternalServerErrorException(`Something blow up with our code ${err}`)
            })
            blobWriter.end(buffer)
        })
        return { 'message': 'Files uploaded' }
    }
}
