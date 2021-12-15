import {
    BadRequestException,
    CACHE_MANAGER,
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserDto } from 'src/modules/users/dto/users.dto';
import { LoginDto } from '../dto/user-login.dto';
import { config } from 'dotenv';
import { Cache } from 'cache-manager'
import * as bcrypt from 'bcrypt';
import { Response} from 'express';
export interface Token {
    id: number;
    email: string;
}

config();
@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async login(userLogin: LoginDto, res: Response): Promise<any> {
        const user = await this.userService.findByEmail(userLogin.email);
        if (!user || !await bcrypt.compare(userLogin.password, user.password) || !user.isEnable  ) {
            throw new UnauthorizedException('Email or password is incorrect!!')
        }    
        //generate access token
        const accessToken = this.generateToken(user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRATION)
        const refreshToken = this.generateToken(user, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRATION)
        await this.cacheManager.set(user.email, refreshToken, { ttl: 1000 })
        res.setHeader("access_token", accessToken);
        res.setHeader("refresh_token", refreshToken);
        return res.json({
            success: true,
            message: 'Login success'
        })
    }

    generateToken(user: UserDto | { id: number, email: string }, secretSignature: string, tokenLife: string) {
        const options: JwtSignOptions = {
            secret: secretSignature
        }
        options.expiresIn = tokenLife
        const email = user.email
        return this.jwtService.sign(
            {
                id: user.id,
                email
            },
            options
        )
    }

    async verifyToken(token: string) {
        const options: JwtSignOptions = {
            secret: process.env.ACCESS_TOKEN_SECRET
        }
        options.expiresIn = process.env.ACCESS_TOKEN_EXPIRATION
        let decoded = this.jwtService.decode(token) as Token
        if (!decoded) {
            return {
                isValid: false,
                mess: "Invalid token",
                id: -1,
                email: ''
            }
        }
        try {
            this.jwtService.verify<Token>(token, options)
            return {
                isValid: true,
                mess: "Valid token",
                ...decoded
            }
        } catch (e) {
            return {
                isValid: false,
                mess: "Access token timeout",
                ...decoded
            }
        }
    }

    async verifyRefreshToken(refreshTokenFromClient: string) {    
        const { email } = this.jwtService.decode(refreshTokenFromClient) as Token
        const refreshToken = await this.cacheManager.get(email) as string
        if (refreshToken && refreshToken.localeCompare(refreshTokenFromClient) == 0) {
            try {
                const options: JwtSignOptions = {
                    secret: process.env.REFRESH_TOKEN_SECRET
                }
                options.expiresIn = process.env.REFRESH_TOKEN_EXPIRATION
                this.jwtService.verify<Token>(refreshTokenFromClient, options)
                const { id, email } = this.jwtService.decode(refreshToken) as Token
                return { accessToken: this.generateToken({ id, email }, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRATION) }
            } catch (e) {
                await this.cacheManager.del(email)
                throw new ForbiddenException('Refresh token timeout')
            }
        }else{
            throw new UnauthorizedException('Refresh token does not exist')
        }
    }

    async verifyEmail(verificationCode : string,email : string){
        const user = await this.userService.findByEmail(email)
        if(!user || !user.verificationCode ||user.verificationCode.localeCompare(verificationCode)!=0){
            throw new BadRequestException('Parameter is invalid')
        }
        this.userService.updateIsEnable(email,true)
        return {message : 'Verification successful'}
    }


}
