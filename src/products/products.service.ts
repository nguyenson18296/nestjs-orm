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
    pageQuery?: number,
    limitQuery?: number,
    sort?: string,
  ) {
    const limit = limitQuery ? parseInt(limitQuery.toString(), 10) : 10;
    const page = pageQuery ? parseInt(pageQuery.toString(), 10) : 1;
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

    if (sort === 'price_low_to_high') {
      query.orderBy('product.price', 'ASC');
    }

    if (sort === 'price_high_to_low') {
      query.orderBy('product.price', 'DESC');
    }

    if (sort === 'product_name_a_to_z') {
      query.orderBy('product.title', 'ASC');
    }

    if (sort === 'product_name_z_to_a') {
      query.orderBy('product.title', 'DESC');
    }

    query.leftJoinAndSelect('product.category', 'category');
    query.skip((page - 1) * limit);
    query.take(limit);

    const [result, total] = await query.getManyAndCount();

    return {
      data: result,
      success: true,
      page: page,
      limit: limit,
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
    page: pageQuery,
    limit: limitQuery,
  }: {
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const limit = limitQuery ? parseInt(limitQuery.toString(), 10) : 10;
    const page = pageQuery ? parseInt(pageQuery.toString(), 10) : 1;

    try {
      const entityManager = this.orderItemRepository.manager;
      let sql = `
          SELECT
              p.id AS "id",
              p.title AS "title",
              p.thumbnail AS "thumbnail",
              p.slug AS "slug",
              p.price AS "price",
              p.discount_price AS "discount_price",
              p.in_stock AS "in_stock",
              p.images as "images",
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
          LIMIT ${limit};
      `;

      const result = await entityManager.query(sql);

      let countSql = `
        SELECT
            COUNT(DISTINCT p.id) AS "total"
        FROM
            order_item oi
        INNER JOIN
          product p ON oi.product_id = p.id
        INNER JOIN
          "order" o ON oi.order_id = o.id
        WHERE
          o.payment_status = 'COMPLETED'
      `
      if (conditions.length > 0) {
        countSql += ' AND ' + conditions.join(' AND ');
      }

      const countResult = await entityManager.query(countSql);
      const total = countResult[0]['total'];

      const resultTransformed = result.map((item: any) => ({
        ...item,
        images: item.images ? item.images.split(',') : [],
      }));
      return {
        data: resultTransformed,
        success: true,
        page,
        limit,
        total: +total,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async getLatestProducts({
    page: pageQuery,
    limit: limitQuery,
  }: {
    page?: number;
    limit?: number;
  }) {
    const limit = limitQuery ? parseInt(limitQuery.toString(), 10) : 10;
    const page = pageQuery ? parseInt(pageQuery.toString(), 10) : 1;

    try {
      const result = await this.productsRepository
        .createQueryBuilder('product')
        .select([
          'product.id as id',
          'product.title as title',
          'product.thumbnail as thumbnail',
          'product.slug as slug',
          'product.price as price',
          'product.discount_price as discount_price',
          'product.in_stock as in_stock',
          'product.images as product_images',
        ])
        .orderBy('product.created_at', 'DESC')
        .skip((page - 1) * limit)
        .take(10)
        .getRawMany();
      
      const resultTransformed = result.map((item: any) => ({
        ...item,
        product_images: item.product_images ? item.product_images.split(',') : [],
      }))

      const total = await this.productsRepository
        .createQueryBuilder('product')
        .getCount();

      return {
        data: resultTransformed,
        success: true,
        page,
        limit,
        total,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async getProductsByCategory(category_slug: string, queries: {
    page?: number;
    limit?: number
  }) {
    const limit = queries.limit ? parseInt(queries.limit.toString(), 10) : 10;
    const page = queries.limit ? parseInt(queries.limit.toString(), 10) : 1;
    try {
      const result = await this.productsRepository
        .createQueryBuilder('product')
        .select('product.id', 'id')
        .addSelect('product.title', 'title')
        .addSelect('product.price', 'price')
        .addSelect('product.discount_price', 'discount_price')
        .addSelect('product.thumbnail', 'thumbnail')
        .addSelect('product.slug', 'slug')
        .addSelect('product.images', 'images')
        .addSelect('product.in_stock', 'in_stock')
        .addSelect('category.title', 'category_title')
        .innerJoin('product.category', 'category')
        .where('category.slug = :category_slug', { category_slug })
        .skip((page - 1) * limit)
        .take(limit)
        .getRawMany();

      const total = await this.productsRepository
        .createQueryBuilder('product')
        .innerJoin('product.category', 'category')
        .where('category.slug = :category_slug', { category_slug })
        .getCount();
      
      const resultTransformed = result.map((item: any) => ({
        ...item,
        images: item.images ? item.images.split(',') : [],
      }));

      return {
        data: resultTransformed,
        page,
        limit,
        total,
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
