import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import User from './user.entity';
import UsersController from './users.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles/roles.guard';
import { NotificationService } from 'src/notifications/notifications.service';
import { Notification } from 'src/notifications/notification.entity';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notification])],
  controllers: [UsersController],
  providers: [
    UsersService,
    NotificationService,
    NotificationsGateway,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
