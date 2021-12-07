import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/user-login.dto';
import { ApiResponse } from '@nestjs/swagger';
import { RefreshToken } from '../dto/refresh-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService

  ) { }


  @Post('login')
  @ApiResponse({status:201,description:'Login successful',schema:{example:{"refresh token":"string","access token":"string"}}})
  @ApiResponse({ status: 401, description: 'Unauthorized' ,schema:{example:{"message":"User does not exist"}}})
  login(@Body() userLogin: LoginDto) {
    return this.authService.validate(userLogin)
  }

  @Post('refresh-token')
  @ApiResponse({status:201,description:'New access token is generated',schema:{example:{"accessToken":"string"}}})
  @ApiResponse({ status: 403})
  refreshToken(@Body()refreshTokenFromClient : RefreshToken){
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
}