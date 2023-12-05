import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import CategoryServices from './categories.service';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import CreateCategoryDto from './dto/createCategory.dto';

@Controller('categories')
export default class CategoriesController {
  constructor(private readonly categoriesService: CategoryServices) {}

  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createCategory(@Body() category: CreateCategoryDto) {
    return this.categoriesService.createCategory(category);
  }
}
