import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';

import Category from './category.entity';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Injectable()
export default class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAllCategories() {
    try {
      const categories = await this.categoryRepository
        .createQueryBuilder('category')
        .leftJoin('category.products', 'product') // Assuming 'products' is the correct relation name
        .select('category.id', 'id')
        .addSelect('category.title', 'title')
        .addSelect('category.orders', 'orders')
        .addSelect('category.slug', 'slug')
        .addSelect('category.thumbnail', 'thumbnail')
        .addSelect('category.description', 'description')
        .addSelect('COUNT(product.id)', 'product_count') // Aggregate function
        .groupBy('category.id')
        .addGroupBy('category.title')
        .orderBy('category.orders', 'ASC')
        .getRawMany(); // Use getRawMany to handle the raw output

      return {
        data: categories,
        success: true,
        status: HttpStatus.OK,
      }
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async getCategoryBySlug(slug: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: {
          slug,
        },
      });
      if (category) {
        return {
          data: category,
          success: true,
          status: HttpStatus.OK
        };
      }
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
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

  async updateCategoryOrder(categoryId: number, orderNumber: number) {
    // Begin transaction
    await this.categoryRepository.manager.transaction(async (entityManager) => {
      const item = await entityManager.findOne(Category, {
        where: {
          id: categoryId,
        },
      });
      if (!item) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      const affectedItems = await entityManager.find(Category, {
        where: {
          orders: MoreThanOrEqual(orderNumber),
        },
        order: {
          orders: 'ASC',
        },
      });

      item.orders = orderNumber;
      await entityManager.save(item);

      // Increment the order of subsequent items
      for (const i of affectedItems) {
        if (i.id !== item.id) {
          i.orders += 1;
          await entityManager.save(i);
        }
      }
    });
  }

  async deleteCategory(id: number) {
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
