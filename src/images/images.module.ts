import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ImagesController from './images.controller';
import ImagesService from './image.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import Image from './image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [ImagesController],
  providers: [ImagesService, CloudinaryService],
})
export class ImagesModule {}
