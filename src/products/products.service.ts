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
  ) {
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

    const [result, total] = await query.getManyAndCount();

    return {
      data: result,
      total,
      status: HttpStatus.OK,
    };

    // const [result, total] = await this.productsRepository
    //   .createQueryBuilder('post')
    //   .leftJoinAndSelect('post.category', 'category')
    //   .getManyAndCount();

    // return {
    //   data: result,
    //   total,
    //   status: HttpStatus.OK,
    // };
  }

  async createProduct(product: CreateProductDto) {
    const newProduct = await this.productsRepository.create(product);
    await this.productsRepository.save(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: UpdateProductDto) {
    await this.productsRepository.update(id, product);
    const updatedProduct = await this.productsRepository.findOne({
      where: {
        id,
      },
    });
    if (updatedProduct) {
      return updatedProduct;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
}
