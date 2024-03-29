import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Category from './category.entity';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Injectable()
export default class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  getAllCategories() {
    return this.categoryRepository.find();
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (category) {
      return category;
    }
    throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }

  async createCategory(category: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(category);
    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: UpdateCategoryDto) {
    await this.categoryRepository.update(id, category);
    const updatedCategory = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (updatedCategory) {
      return updatedCategory;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async deleteCateogry(id: number) {
    try {
      await this.categoryRepository.delete(id);
      return {
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
