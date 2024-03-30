import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Product from './product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export default class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getAllProducts(
    category_ids?: string[],
    min_price?: string,
    max_price?: string,
    search?: string,
  ) {
    console.log('search', search);
    const query = await this.productsRepository.createQueryBuilder('product');

    if (category_ids?.length > 0) {
      query
        .leftJoinAndSelect('product.category', 'category')
        .where('category.id IN (:...category_ids)', { category_ids });
    }

    if (!!min_price) {
      query.andWhere(`product.price >= :minPrice`, { minPrice: min_price });
    }

    if (!!max_price) {
      query.andWhere(`product.price <= :maxPrice`, { maxPrice: +max_price });
    }

    if (!!search) {
      query.andWhere(
        `LOWER(unaccent(product.title)) like LOWER(unaccent(:title))`,
        {
          title: `%${search}%`,
        },
      );
    }

    query.leftJoinAndSelect('product.category', 'category');

    const [result, total] = await query.getManyAndCount();

    return {
      data: result,
      total,
      status: HttpStatus.OK,
    };
  }

  async getRandomProducts(numberOfRow: number) {
    try {
      const result = await this.productsRepository
        .createQueryBuilder('product')
        .orderBy('RANDOM()')
        .limit(numberOfRow)
        .getMany();

      return {
        data: result,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      return {
        data: null as any,
        success: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async searchProducts(name: string) {
    try {
      const product = await this.productsRepository
        .createQueryBuilder('product')
        .where('product.title like :name', { name })
        .getMany();
      return {
        success: true,
        status: HttpStatus.OK,
        data: product,
      };
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }

  async getProductDetail(slug: string) {
    const result = await this.productsRepository.findOne({
      where: {
        slug: slug,
      },
      relations: {
        comments: {
          user: true,
          replies: {
            user: true,
          },
        },
      },
    });

    if (result) {
      return {
        data: result,
        success: true,
        status: HttpStatus.OK,
      };
    }

    return {
      data: null,
      success: false,
      status: HttpStatus.NOT_FOUND,
    };
  }

  async createProduct(product: CreateProductDto) {
    const newProduct = await this.productsRepository.create(product);
    await this.productsRepository.save(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: UpdateProductDto) {
    try {
      // Perform the update operation
      const updateResult = await this.productsRepository.update(id, product);

      // Check if the entity was found and updated
      if (updateResult.affected === 0) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      // Retrieve the updated entity
      const updatedProduct = await this.productsRepository.findOneBy({ id });
      if (!updatedProduct) {
        throw new HttpException(
          'Product not found after update',
          HttpStatus.NOT_FOUND,
        );
      }

      // Return the updated entity
      return updatedProduct;
    } catch (e) {
      throw new HttpException(
        'Error updating product: ' + e.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
