import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { NotificationsGateway } from './notifications.gateway';
import { CreateNotificationDto } from './dto/createNotificationDto';
import { Notification } from './notification.entity';
import User from 'src/users/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  sendNotification(notificationData: any): void {
    this.notificationsGateway.sendToAll(notificationData);
  }

  async createNotification(
    notification: CreateNotificationDto,
    user_id: number,
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: user_id,
        },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const formData: CreateNotificationDto = {
        ...notification,
        user,
      };
      const newNotification = this.notificationRepository.create(formData);
      await this.notificationRepository.save(newNotification);
      this.sendNotification(newNotification);
      return newNotification;
    } catch (e) {
      throw new HttpException('Error' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async getNotificationsByUser(user_id: number) {
    try {
      const response = await this.notificationRepository.find({
        where: {
          user: {
            id: user_id,
          },
        },
      });
      return {
        success: true,
        data: response,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
