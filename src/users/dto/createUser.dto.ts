export class CreateUserDto {
  username: string;
  emai: string;
  password: string;
  email_confirm: boolean;
  avatar?: string;
}
