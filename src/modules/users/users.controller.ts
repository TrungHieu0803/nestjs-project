import { Body, Controller, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { UserDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from '@nestjs/swagger'
import { ResetPasswordDto } from './dto/user-reset-password.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get(':id')
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findOne(@Param("id", ParseIntPipe) id: number): Promise<UserDto> {
        return this.userService.findOne(id)
    }

    @Get()
    @ApiResponse({ status: 400, description: 'Bad Request', type: null })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    findAll(): Promise<UserDto[]> {
        return this.userService.findAll()
    }

    @Put()
    @ApiResponse({ status: 201, description: 'Successful update' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    updateUser(@Body() user: UserDto) {
        return this.userService.updateUser(user)
    }

    @Get('reset-password/:email')
    @ApiOkResponse({schema:{example:{message:'Check email'}}})
    @ApiResponse({status:400,description:'Resource not found',schema:{example:{status:400,message:'The email is not registered',error:'Not found'}}})
    @ApiResponse({status:500,schema:{example:{status:500,message:'Can not send email',error:'Internal server'}}})
    sendSecurityCode(@Param('email')email :string) : Promise<any>{
        return this.userService.sendSecurityCode(email)
    }
    
    @Put('reset-password')
    @ApiOkResponse({schema:{example:{message:'Password is changed'}}})
    @ApiResponse({status:400,description:'Bad request',schema:{example:{status:400,message:'Security code is incorrect',error:'Bad request'}}})
    resetPassword(@Body() info : ResetPasswordDto){
        return this.userService.resetPassword(info)
    }

}
