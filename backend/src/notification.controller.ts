import { Controller, Post, Body } from '@nestjs/common';
import { EtherJsHost } from './etherJsHost';

@Controller()
export class NotificationController {
  constructor(private readonly etherJsHost: EtherJsHost) {}

  @Post('register-device')
  async registerDevice(@Body() body: { token: string }) {
    return await this.etherJsHost.addDeviceToken(body.token);
  }
}