import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';

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
}
