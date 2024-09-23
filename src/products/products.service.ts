import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Product from './product.entity';
import Order from 'src/orders/order.entity';
import OrderItem from 'src/orders/orderItem.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export default class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>, // private notificationService: NotificationService,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async getAllProducts(
    category_ids?: string[],
    min_price?: string,
    max_price?: string,
    search?: string,
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
      throw new HttpException('Error ' + e, HttpStatus.BAD_REQUEST);
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
      // relations: {
      //   comments: {
      //     user: true,
      //     replies: {
      //       user: true,
      //     },
      //   },
      // },
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

  async getBestSellingProducts({
    start_date,
    end_date,
  }: {
    start_date?: string;
    end_date?: string;
  }): Promise<any> {
    try {
      const entityManager = this.orderItemRepository.manager;
      let sql = `
          SELECT
              p.id AS "product_id",
              p.title AS "product_title",
              p.thumbnail AS "product_thumbnail",
              p.slug AS "product_slug",
              p.price AS "product_price",
              p.discount_price AS "product_discount_price",
              p.in_stock AS "product_in_stock",
              p.images as "product_images",
              SUM(oi.quantity) AS "total_sold"
          FROM
              order_item oi
          INNER JOIN
              product p ON oi.product_id = p.id
          INNER JOIN
              "order" o ON oi.order_id = o.id
          WHERE
              o.payment_status = 'COMPLETED'
      `;

      const conditions = [];
      if (start_date) {
        conditions.push(`o.created_at >= '${start_date}'`);
      }
      if (end_date) {
        conditions.push(`o.created_at <= '${end_date}'`);
      }
      if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ');
      }

      sql += `
          GROUP BY
              p.id, p.title, p.thumbnail
          ORDER BY
              total_sold DESC
          LIMIT 10;
      `;

      const result = await entityManager.query(sql);
      const resultTransformed = result.map((item: any) => ({
        ...item,
        product_images: item.product_images ? item.product_images.split(',') : [],
      }));
      return {
        data: resultTransformed,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async getLatestProducts() {
    try {
      const result = await this.productsRepository
        .createQueryBuilder('product')
        .select([
          'product.id',
          'product.title',
          'product.thumbnail',
          'product.slug',
          'product.price',
          'product.discount_price',
          'product.in_stock',
          'product.images',
        ])
        .orderBy('product.created_at', 'DESC')
        .limit(10)
        .getRawMany();
      
      const resultTransformed = result.map((item: any) => ({
        ...item,
        product_images: item.product_images ? item.product_images.split(',') : [],
      }))

      return {
        data: resultTransformed,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async getProductsByCategory(category_slug: string) {
    try {
      const result = await this.productsRepository
        .createQueryBuilder('product')
        .innerJoin('product.category', 'category')
        .where('category.slug = :category_slug', { category_slug })
        .getMany();
      return {
        data: result,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error ' + e, HttpStatus.BAD_REQUEST);
    }
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
      return updatedProduct;
    } catch (e) {
      throw new HttpException(
        'Error updating product: ' + e.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
