import {
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
import { environments } from 'src/enviroments/enviroments';
import { Cache } from 'cache-manager'
export interface Token {
    id: number;
    email: string;
}
@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async validate(userLogin: LoginDto): Promise<any> {
        const user = await this.userService.findByEmail(userLogin.email);
        if (!user) {
            throw new UnauthorizedException('User does not exist')
        }
        if (userLogin.password !== user.password) {
            throw new UnauthorizedException('Incorrect password')
        }

        //generate access token
        const accessToken = this.generateToken(user, environments.accessTokenSecret, environments.accessTokenExpiration)
        const refreshToken = this.generateToken(user, environments.refreshTokenSecret, environments.refreshTokenExpiration)
        await this.cacheManager.set("refreshToken", refreshToken, { ttl: 1000 })
        return { accessToken, refreshToken }
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
            secret: environments.accessTokenSecret
        }
        options.expiresIn = environments.accessTokenExpiration
        let decoded = this.jwtService.decode(token) as Token
        if (!decoded) {
            return {
                isValid: false,
                mess: "Invalid token"
            }
        }
        try {
            this.jwtService.verify<Token>(token, options)
            return {
                isValid: true,
                mess: "Valid token"
            }
        } catch (e) {
            return {
                isValid: false,
                mess: "Access token timeout"
            }
        }
    }
    async verifyRefreshToken(refreshTokenFromClient: string) {
        const options: JwtSignOptions = {
            secret: environments.refreshTokenSecret
        }
        options.expiresIn = environments.refreshTokenExpiration
        try {
            this.jwtService.verify<Token>(refreshTokenFromClient, options)
            const refreshToken = await this.cacheManager.get("refreshToken") as string
            const { id, email } = this.jwtService.decode(refreshToken) as Token
            return  {accessToken : this.generateToken({ id, email }, environments.accessTokenSecret, environments.accessTokenExpiration)}
        } catch (e) {
            await this.cacheManager.del('refreshToken')
            throw new ForbiddenException('Refresh token timeout')
        }
    }


}
