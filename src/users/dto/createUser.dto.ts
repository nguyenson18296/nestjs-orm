import { Role } from '../roles/role.enum';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  email_confirm: boolean;
  avatar?: string;
  role?: Role;
}
