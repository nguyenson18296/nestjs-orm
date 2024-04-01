import { Module } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Notification } from './notification.entity';
import NotificationsController from './notification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User])],
  providers: [NotificationService, NotificationsGateway, UsersService],
  controllers: [NotificationsController],
  exports: [NotificationService, NotificationsGateway],
})
export class NotificationsModule {}
