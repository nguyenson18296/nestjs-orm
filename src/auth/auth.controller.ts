import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginDto) {
    try {
      return this.authService.singIn(payload);
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req: any) {
    const email = req?.user?.email;
    return this.authService.getMe(email);
  }
}
