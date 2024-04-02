import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notifications.service';

import { CreateNotificationDto } from './dto/createNotificationDto';

@Controller('notifications')
export default class NotificationsController {
  constructor(private readonly notificationsService: NotificationService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createUserNotification(
    @Body() notification: CreateNotificationDto,
    user_id: number,
  ) {
    return this.notificationsService.createNotification(notification, user_id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getUserNotifications(@Request() req: any) {
    return this.notificationsService.getNotificationsByUser(req.user.user_id);
  }
}
