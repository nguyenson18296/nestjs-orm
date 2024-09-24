import User from '../../users/user.entity';

export interface CreateNotificationDto {
  type: string;
  message: string;
  user?: User;
  is_read: boolean;
  url?: string;
  data?: any;
}
