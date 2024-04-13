import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import CategoriesService from './categories.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('categories')
export default class Categories {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(Number(id));
  }

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createCategory(
    @Body() category: CreateCategoryDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    try {
      const file = await this.cloudinaryService.uploadFile(thumbnail);
      if (file) {
        category.thumbnail = file.url;
      }
      return this.categoriesService.createCategory(category);
    } catch (e) {
      throw new HttpException('Error' + e, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  updateCategory(
    @Param() { id }: { id: number },
    @Body() category: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, category);
  }

  @Put(':id/order')
  updateCategoryOrder(
    @Param() { id }: { id: number },
    @Body() { order_number }: { order_number: number },
  ) {
    return this.categoriesService.updateCategoryOrder(id, order_number);
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(Number(id));
  }
}
