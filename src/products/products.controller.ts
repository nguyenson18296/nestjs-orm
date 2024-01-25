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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import ProductsService from './products.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Controller('products')
export default class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
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
