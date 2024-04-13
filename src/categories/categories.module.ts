import { Module } from '@nestjs/common';

import CategoriesController from './categories.controller';
import CategoriesService from './categories.service';
import Category from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CloudinaryService],
})
export class CategoriesModule {}
