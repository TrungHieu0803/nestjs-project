import { ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './users.entity';
import { UserDto } from './dto/users.dto';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private usersRepository : Repository<UserEntity>,
        @Inject(forwardRef(() => MailService)) private mailService: MailService      
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

    async addUser(user :UserRegisterDto): Promise<any> {
        if(await this.findByEmail(user.email)){
            throw new ConflictException('This email address is already being used')
        }
        const userEntity = UserRegisterDto.toEntity(user)
        const verificationCode  = Math.floor(Math.random() * 10000) 
        userEntity.password = await bcrypt.hash(user.password,10)  
        userEntity.isEnable = false 
        userEntity.verificationCode = verificationCode.toString()    
        Object.keys(userEntity).forEach(key => userEntity[key] === undefined ? delete userEntity[key] : {});
        await this.usersRepository.save(userEntity)
        return this.mailService.verifyEmail(userEntity.email,verificationCode)
    }

    async updateUser(user : UserDto) : Promise<UpdateResult>{
        return await this.usersRepository.update(user.id,UserDto.toEntity(user))
    }

    async updateIsEnable(email : string,isEnable : boolean) : Promise<UpdateResult>{
        return await this.usersRepository.createQueryBuilder().update().set({isEnable :isEnable,verificationCode:''})
                    .where("email=:email",{email:email}).execute()
    }

}
