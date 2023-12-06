import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { UsersService } from './users.service';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import CreateUserDto from './dto/createUser.dto';
import { File } from '../files/file.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: { fileSize: 2097152 }, // 2MB --- 2*2^20
      fileFilter: (req, file, callback) => {
        return file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)
          ? callback(null, true)
          : callback(
              new BadRequestException('Only image files are allowed'),
              false,
            );
      },
    }),
  )
  @UseGuards(JwtAuthenticationGuard)
  async createUser(
    @Body() userData: CreateUserDto,
    @UploadedFile() avatar: File,
  ) {
    console.log('avatar', avatar);
    const response = await this.usersService.createUser(userData, avatar);
    console.log('response', response);
    return {
      success: true,
      data: response,
    };
  }
}
