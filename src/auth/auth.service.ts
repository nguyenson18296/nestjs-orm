import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/loginDto';
import User from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async singIn(data: LoginDto): Promise<{
    data: User;
    access_token?: string;
    status?: HttpStatus;
    success: boolean;
  }> {
    const user = await this.usersService.findOneUser(data.email);
    if (user) {
      const isMatch = await bcrypt.compare(data.password, user?.password);

      if (!isMatch) {
        throw new UnauthorizedException();
      }
      delete user.password;
      const payload = { email: user.email, user_id: user.id, is_user: true };
      const access_token = await this.jwtService.signAsync(payload, {
        secret: 'secret',
      });
      return {
        data: user,
        success: true,
        status: HttpStatus.OK,
        access_token,
      };
    }

    throw new UnauthorizedException();
  }

  async getMe(email: string) {
    try {
      const user = await this.usersService.findOneUser(email);
      if (!user) {
        throw new HttpException('Error', HttpStatus.NOT_FOUND);
      }
      return {
        data: user,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
