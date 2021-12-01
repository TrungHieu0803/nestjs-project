import {
    BadRequestException,
    forwardRef,
    HttpException,
    Inject,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { UserDto } from 'src/modules/users/dto/users.dto';
import { LoginDto } from '../dto/user-login.dto';

@Injectable()
export class AuthService{
    constructor(
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
        private jwtService : JwtService
    ){}

    async validate(userLogin :LoginDto): Promise<any>{
        const user = await this.userService.findByEmail(userLogin.email);
        if(!user){
            throw new UnauthorizedException('User does not exist')
        } 
        if(userLogin.password !== user.password){
            throw new UnauthorizedException('Incorrect password')
        }
        return this.signUser(user)
    }
    signUser(userDto : UserDto){
        const email = userDto.email
        return this.jwtService.sign({
            sub: userDto.id,
            email,
        });
    }
}
