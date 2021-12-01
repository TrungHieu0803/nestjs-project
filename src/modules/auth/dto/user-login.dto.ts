import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { EphemeralKeyInfo } from 'tls'


export class LoginDto{
    @IsNotEmpty()
    @IsEmail()
    email : string

    @IsNotEmpty()
    @IsString()
    password : string

}