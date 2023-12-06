import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import User from './user.entity';
import CloudStorageService from 'src/services/cloud-storage.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, CloudStorageService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
