import { Controller, Get, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {

    constructor(
        private notificationsService: NotificationsService
    ) { }

    @Get()
    @ApiBearerAuth()
    @ApiOkResponse({ schema: { example: 'List of 5 notifications' } })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'error description', error: 'Internal server' } } })
    get5Notification(@Request() req) {
        return this.notificationsService.getTop5(parseInt(req.headers.id));
    }
}
