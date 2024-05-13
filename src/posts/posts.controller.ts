import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

import PostsService from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { NotificationService } from 'src/notifications/notifications.service';

@Controller('posts')
export default class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly notificationsService: NotificationService,
  ) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get('user/:user_id')
  getAllPostsByUser(@Param('user_id') user_id: string) {
    return this.postsService.getAllPostsByUser(+user_id);
  }

  @Get('/my-posts')
  @UseGuards(AuthGuard('jwt'))
  getMyPosts(@Request() req: any) {
    return this.postsService.getAllPostsByUser(Number(req.user.user_id));
  }

  @Get('username/:user_name')
  getUserPosts(@Param('user_name') user_name: string) {
    return this.postsService.getAllPostsByUser(undefined, user_name);
  }

  @Get('/random')
  getRandomPosts(offset: number) {
    return this.postsService.getRandomPosts(offset);
  }

  @Get(':slug')
  getPostById(@Param('slug') slug: string) {
    return this.postsService.getPostBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createPost(
    @Body() post: CreatePostDto,
    @Request() req: any,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    try {
      if (thumbnail) {
        const file = await this.cloudinaryService.uploadFile(thumbnail);
        if (file) {
          post.cover_photo = file.secure_url;
        } else {
          post.cover_photo = '';
        }
      }
      this.notificationsService.sendNotification({
        message: 'Có bài viết được cập nhật',
        type: 'new',
        category: 'blogs',
      });
      return this.postsService.createPost(post, Number(req.user.user_id));
    } catch (e) {
      throw new HttpException('Error Controller' + e, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    this.postsService.deletePost(Number(id));
  }
}
