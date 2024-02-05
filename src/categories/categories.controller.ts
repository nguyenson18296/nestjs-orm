import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import CategoriesService from './categories.service';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Controller('categories')
export default class Categories {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(Number(id));
  }

  @Post()
  createCategory(@Body() category: CreateCategoryDto) {
    return this.categoriesService.createCategory(category);
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCateogry(Number(id));
  }
}
