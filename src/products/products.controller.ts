import {
  Post,
  Controller,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpException,
  HttpStatus,
  Put,
  Param,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

import ProductsService from './products.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { isEmpty } from '../utils/utils';
import { NotificationService } from 'src/notifications/notifications.service';

@Controller('products')
export default class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly notificationsService: NotificationService,
  ) {}

  @Get()
  getAllProducts(
    @Query()
    query?: {
      category_ids?: string;
      min_price: string;
      max_price: string;
      search?: string;
    },
  ) {
    if (!isEmpty(query)) {
      const { category_ids, min_price, max_price, search } = query;
      const ids = category_ids?.split(',');
      return this.productsService.getAllProducts(
        ids,
        min_price,
        max_price,
        search,
      );
    }
    return this.productsService.getAllProducts();
  }

  @Get('random')
  getRandomProducts() {
    return this.productsService.getRandomProducts(5);
  }

  @Get(':slug')
  async getProductDetail(@Param() { slug }: { slug: string }) {
    const product = await this.productsService.getProductDetail(slug);

    return product;
  }


  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]))
  async createProduct(
    @Body() product: CreateProductDto,
    @UploadedFiles() thumbnail: Express.Multer.File[],
  ) {
    try {
      const file = await this.cloudinaryService.uploadFile((thumbnail as any).thumbnail[0]);
      if (file) {
        product.thumbnail = file.url;
      }
      const imagesUrls = await Promise.all(
        (thumbnail as any).images.map(async (image: any) => {
          const img = await this.cloudinaryService.uploadFile(image);
          return img.url;
        }),
      ) as string[];
      if (imagesUrls) {
        product.images = imagesUrls;
      }
      await this.productsService.createProduct(product);
      this.notificationsService.sendNotification({
        message: 'Có sản phẩm được cập nhật',
        type: 'update',
        category: 'product',
      });
    } catch (e) {
      throw new HttpException('Error' + e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  // @UseInterceptors(FileFieldsInterceptor([
  //   { name: 'thumbnail', maxCount: 1 },
  //   { name: 'images', maxCount: 5 }
  // ]))
  async editProduct(
    @Param('id') id: number, // Simplified param destructuring
    @Body() product: UpdateProductDto & { user_id: number },
    @UploadedFiles() thumbnail: Express.Multer.File[],
  ) {
    const userId = product.user_id;
    delete product.user_id;
    try {
      if ((thumbnail as any)?.thumbnail?.length > 0) {
        const file = await this.cloudinaryService.uploadFile((thumbnail as any).thumbnail[0]);
        if (file) {
          product.thumbnail = file.url;
        }
      }
      // if ((thumbnail as any).images.length > 0) {
      //   const imagesUrls = await Promise.all(
      //     (thumbnail as any).images.map(async (image: any) => {
      //       const img = await this.cloudinaryService.uploadFile(image);
      //       return img.url;
      //     }),
      //   ) as string[];
      //   if (imagesUrls) {
      //     product.images = imagesUrls;
      //   }
      // }
      const updatedProduct = await this.productsService.updateProduct(
        id,
        product,
      );
      this.notificationsService.createNotification(
        {
          type: 'update',
          message: `Sản phẩm ${updatedProduct.title} được cập nhật`,
          is_read: false,
        },
        userId,
      );
    } catch (e) {
      console.log('e', e)
      throw new HttpException('Error ' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
