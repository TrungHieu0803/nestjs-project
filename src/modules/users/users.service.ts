import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './users.entity';
import { UserDto } from './dto/users.dto';
import { UserRegisterDto } from '../auth/dto/user-register.dto';

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

    async findByEmail(email:string): Promise<UserDto | undefined>{
        const result = await this.usersRepository.findOne({where:{"email":email}})
        return result ? UserDto.fromEntity(result) : null
    }
    

    async findAll(): Promise<UserDto[]>{
        const result =  (await this.usersRepository.find()).map((userEntity)=>{
            return UserDto.fromEntity(userEntity)
        })       
        return result
    }

    async addUser(user :UserRegisterDto) : Promise<UserRegisterDto>{
        const userEntity = UserRegisterDto.toEntity(user)        
        Object.keys(userEntity).forEach(key => userEntity[key] === undefined ? delete userEntity[key] : {});
        return await this.usersRepository.save(userEntity)
    }
    async updateUser(user : UserDto) : Promise<UpdateResult>{
        return await this.usersRepository.update(user.id,UserDto.toEntity(user))
    }
    async updateRefreshToken(user : UserDto, refreshToken : string) : Promise<UpdateResult>{
        return await this.usersRepository.createQueryBuilder().update().set({refreshToken: refreshToken}).where("id = :id", { id: user.id }).execute()
    }


}
