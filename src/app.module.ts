import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { PassportModule } from '@nestjs/passport';

import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ImagesModule } from './images/images.module';
import { UploadModule } from './upload/upload.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductReviewsModule } from './product-reviews/product-reviews.module';
import { CartModule } from './cart/cart.module';
import { NotificationsModule } from './notifications/notifications.module';
import PostTagModule from './post-tag/post-tag.module';
import { OrderModules } from './orders/orders.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { MeModule } from './me/me.module';
import { ColumnsModule } from './columns/columns.module';
import { TasksModule } from './tasks/tasks.module';
import { LabelsModule } from './labels/labels.module';

@Module({
  imports: [
    PostsModule,
    CategoriesModule,
    ProductsModule,
    UploadModule,
    CloudinaryModule,
    ImagesModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductReviewsModule,
    CartModule,
    NotificationsModule,
    PostTagModule,
    OrderModules,
    VouchersModule,
    MeModule,
    ColumnsModule,
    TasksModule,
    LabelsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
