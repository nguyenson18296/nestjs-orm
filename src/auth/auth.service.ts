import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/loginDto';
import User from 'src/users/user.entity';

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
    const user = await this.usersService.findOneUser(data.username);
    console.log('user', user);

    if (user) {
      const isMatch = await bcrypt.compare(data.password, user?.password);

      if (!isMatch) {
        throw new UnauthorizedException();
      }
      delete user.password;
      const payload = { email: user.email };
      return {
        data: user,
        success: true,
        access_token: await this.jwtService.signAsync(payload, {
          secret: 'secret',
        }),
      };
    }

    throw new UnauthorizedException();
  }
}
