import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationService } from './notifications.service';

import { CreateNotificationDto } from './dto/createNotificationDto';

@Controller('notifications')
export default class NotificationsController {
  constructor(private readonly notificationsService: NotificationService) {}

  @Post()
  createUserNotification(
    @Body() notification: CreateNotificationDto,
    user_id: number,
  ) {
    return this.notificationsService.createNotification(notification, user_id);
  }

  @Get(':id')
  getUserNotifications(@Param(':id') id: number) {
    console.log('id', id);
    return this.notificationsService.getNotificationsByUser(id);
  }
}
