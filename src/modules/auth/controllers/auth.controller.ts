import {   
    Body,
    Controller,  
    Post,  
  } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/user-login.dto';
import { ApiResponse } from '@nestjs/swagger';


  @Controller('auth')
  export class AuthController{
      constructor(
        private readonly authService : AuthService
      ){}


      @Post('login')
      @ApiResponse({ status: 400, description: 'Bad Request' })
      @ApiResponse({ status: 401, description: 'Unauthorized' })
      login(@Body() userLogin : LoginDto){
        return this.authService.validate(userLogin)
      }
  }