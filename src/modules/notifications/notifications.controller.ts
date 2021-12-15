import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {

    constructor(
        private notificationsService: NotificationsService
    ) { }

    @Get()
    @ApiOkResponse({schema: {example: 'List of 5 notifications'}})
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'error description', error: 'Internal server' } } })
    getNotification() {
        return this.notificationsService.getTop5();
    }
}
