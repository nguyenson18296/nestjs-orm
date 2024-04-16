import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import PostsController from './posts.controller';
import PostsService from './posts.service';
import Post from './post.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { NotificationService } from 'src/notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { Notification } from 'src/notifications/notification.entity';
import { UsersService } from 'src/users/users.service';
import User from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Notification])],
  controllers: [PostsController],
  providers: [
    PostsService,
    CloudinaryService,
    NotificationService,
    NotificationsGateway,
    UsersService,
  ],
})
export class PostsModule {}
