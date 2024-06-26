import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import User from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    const query = await this.userRepository.createQueryBuilder('user');

    const [result, total] = await query.getManyAndCount();

    return {
      data: result,
      total,
      success: true,
      status: HttpStatus.OK,
    };
  }

  async findUser(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        data: null,
        success: false,
        status: HttpStatus.NOT_FOUND,
      };
    }

    return {
      data: user,
      success: true,
      status: HttpStatus.OK,
    };
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return {
        data: null,
        success: false,
        status: HttpStatus.NOT_FOUND,
      };
    }

    return {
      data: user,
      success: true,
      status: HttpStatus.OK,
    };
  }

  async findOneUser(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  async createUser(user: CreateUserDto) {
    const hashPassword = await bcrypt.hash(user.password, saltOrRounds);
    const data = {
      ...user,
      password: hashPassword,
    };
    const newUser = await this.userRepository.create(data);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async updateUser(userDto: UpdateUserDto, userId: number) {
    try {
      const user = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(userDto)
        .where('id = :id', { id: userId })
        .execute();
      return {
        success: true,
        status: HttpStatus.OK,
        data: user,
      };
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }
}
