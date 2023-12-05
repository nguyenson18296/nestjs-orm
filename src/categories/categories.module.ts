import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Category from './category.entity';
import CategoriesController from './categories.controller';
import CategoryServices from './categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoryServices],
})
export class CategoriesModule {}
