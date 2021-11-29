import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('demo')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/nestJS')
  getHello(): string {
    return this.appService.getHello();
  }
}
