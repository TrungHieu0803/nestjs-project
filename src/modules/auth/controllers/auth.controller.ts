import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/user-login.dto';
import { ApiBody, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { RefreshToken } from '../dto/refresh-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UsersService } from 'src/modules/users/users.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService
  ) { }


  @Post('login')
  @ApiResponse({ status: 201, description: 'Login successful', schema: { example: { "refresh token": "string", "access token": "string" } } })
  @ApiResponse({ status: 401, description: 'Unauthorized', schema: { example: { "statusCode": 401,"message": "Email or password is incorrect!!","error": "Unauthorized" } } })
  login(@Body() userLogin: LoginDto) {
    return this.authService.login(userLogin)
  }

  @Post('refresh-token')
  @ApiResponse({ status: 201, description: 'New access token is generated', schema: { example: { "accessToken": "string" } } })
  @ApiResponse({ status: 401, description: 'Refresh token does not exist',schema: { example: { "statusCode": 401,"message": "Refresh token does not exist","error": "Unauthorized" } } })
  @ApiResponse({ status: 403, description: 'Refresh token timeout' ,schema: { example: { "statusCode": 403,"message": "Refresh token timeout","error": "Unauthorized" } }})
  refreshToken(@Body() refreshTokenFromClient: RefreshToken) {
    return this.authService.verifyRefreshToken(refreshTokenFromClient.refreshToken)
  }
  @Get("/facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      payload: req.user,
    };
  }

  @Post('users/register')
  @ApiResponse({ status: 201, description: 'Registration Successful' })
  @ApiResponse({ status: 409, description: 'Conflict',schema:{example:{"statusCode": 409,"message": "This email address is already being used","error": "Conflict"}} })
  @ApiResponse({status:500,schema:{example:{status:500,message:'Can not send email',error:'Internal server'}}})
  @ApiBody({ type: UserRegisterDto })
  addUser(@Body() user: UserRegisterDto): Promise<UserRegisterDto> {
    return this.userService.addUser(user)
  }

  @Get('verify-email/:verificationCode/:email')
  @ApiResponse({status:200,description:'Verification Successful'})
  @ApiResponse({status:400,schema:{example:{"statusCode": 400,"message": "Parameter is invalid","error": "Bad request"}}})
  verifyEmail(@Param('verificationCode') vCode: string, @Param('email') email: string): Promise<any> {
    return this.authService.verifyEmail(vCode, email)
  }
}