import { Body, Controller, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { UserDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger'

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

}
