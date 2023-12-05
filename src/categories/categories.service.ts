import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Category from './category.entity';
import CreateCategoryDto from './dto/createCategory.dto';

@Injectable()
export default class CategoryServices {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  getAllCategories() {
    return this.categoryRepository.find({
      relations: {
        posts: true,
      },
    });
  }

  async createCategory(category: CreateCategoryDto) {
    const newCategory = await this.categoryRepository.create(category);

    await this.categoryRepository.save(newCategory);

    return {
      success: true,
      data: newCategory,
    };
  }
}
