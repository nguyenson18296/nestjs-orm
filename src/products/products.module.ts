import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ProductsController from './products.controller';
import ProductsService from './products.service';
import Product from './product.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { NotificationService } from 'src/notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { Notification } from 'src/notifications/notification.entity';
import { UsersService } from 'src/users/users.service';
import User from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Notification, User])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    CloudinaryService,
    NotificationService,
    NotificationsGateway,
    UsersService,
  ],
})
export class ProductsModule {}
