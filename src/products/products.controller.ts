import { Post, Controller, Get, Body } from '@nestjs/common';

import ProductsService from './products.service';
import { CreateProductDto } from './dto/createProduct.dto';

@Controller('products')
export default class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Post()
  async createPost(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }
}
