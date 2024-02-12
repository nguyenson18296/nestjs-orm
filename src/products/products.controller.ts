import {
  Post,
  Controller,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Put,
  Param,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import ProductsService from './products.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { isEmpty } from '../utils/utils';

@Controller('products')
export default class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  getAllProducts(
    @Query()
    query?: {
      category_ids?: string;
      min_price: string;
      max_price: string;
    },
  ) {
    if (!isEmpty(query)) {
      const { category_ids, min_price, max_price } = query;
      const ids = category_ids?.split(',');
      return this.productsService.getAllProducts(ids, min_price, max_price);
    }
    return this.productsService.getAllProducts();
  }

  @Get(':slug')
  async getProductDetail(@Param() { slug }: { slug: string }) {
    const product = await this.productsService.getProductDetail(slug);

    return product;
  }

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createProduct(
    @Body() product: CreateProductDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    try {
      const file = await this.cloudinaryService.uploadFile(thumbnail);
      if (file) {
        product.thumbnail = file.url;
      }
      return this.productsService.createProduct(product);
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async editProduct(
    @Param() { id }: { id: number },
    @Body() productDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productsService.updateProduct(
      id,
      productDto,
    );
    return updatedProduct;
  }
}
