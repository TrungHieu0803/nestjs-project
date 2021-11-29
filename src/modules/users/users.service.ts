import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './users.entity';
import { UserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository : Repository<UserEntity>      
    ){}

    async findOne(id:number): Promise<UserDto>{
        const result = UserDto.fromEntity(await this.usersRepository.findOne(id))
        return result
    }
    

    async findAll(): Promise<UserDto[]>{
        const result =  (await this.usersRepository.find()).map((userEntity)=>{
            return UserDto.fromEntity(userEntity)
        })       
        return result
    }

    async addUser(user :UserDto) : Promise<UserDto>{
        const userEntity = UserDto.toEntity(user)        
        Object.keys(userEntity).forEach(key => userEntity[key] === undefined ? delete userEntity[key] : {});
        console.log(userEntity)
        return await this.usersRepository.save(userEntity)
    }
    async updateUser(user : UserDto) : Promise<UpdateResult>{
        return await this.usersRepository.update(user.id,UserDto.toEntity(user))
    }
    

}
