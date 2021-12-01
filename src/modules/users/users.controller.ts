import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserDto } from './dto/users.dto';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';
import { ApiBody, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger'
import { UserRegisterDto } from '../auth/dto/user-register.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly userService : UsersService){}

    @Get(':id')
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findOne(@Param("id") id : number ) : Promise<UserDto>  {
        return this.userService.findOne(id)
    }

    @Get()
    @ApiResponse({ status: 400, description: 'Bad Request',type:null })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findAll() : Promise<UserDto[]>{
        return this.userService.findAll()
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Successful Registration' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBody({type: UserRegisterDto})
    addUser(@Body() user : UserRegisterDto) : Promise<UserRegisterDto>{
        return this.userService.addUser(user)
    }

    @Put()
    @ApiResponse({ status: 201, description: 'Successful update' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    updateUser(@Body() user : UserDto){
        return this.userService.updateUser(user)
    }

}
