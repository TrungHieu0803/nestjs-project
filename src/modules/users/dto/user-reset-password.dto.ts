import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"




export class ResetPasswordDto implements Readonly<ResetPasswordDto>{

    @IsString()
    @IsEmail()
    @ApiProperty({type:'string',description:'email'})
    email : string

    @ApiProperty({type:'string',description:'password'})
    newPassword : string

    @IsString()
    @ApiProperty({type:'string',description:'security code'})
    securityCode : string
}