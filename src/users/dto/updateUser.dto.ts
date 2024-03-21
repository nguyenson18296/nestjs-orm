import { Role } from '../roles/role.enum';

export class UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  email_confirm?: boolean;
  avatar?: string;
  role?: Role;
}
