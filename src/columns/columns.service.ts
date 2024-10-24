import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import Columns from "./column.entity";
import { CreateColumnDto, TUpdateColumnDto } from "./column.dto";

@Injectable()
export default class ColumnsService {
  constructor(
    @InjectRepository(Columns)
    private columnsRepository: Repository<Columns>
  ) {}

  async getAllColumns() {
    try {
      const [columns, count] = await this.columnsRepository.findAndCount();
      return {
        data: columns,
        total: count,
        success: true,
        status: HttpStatus.OK,
      }
    } catch (e) {
      throw new HttpException("Error Service " + e, HttpStatus.BAD_REQUEST);
    }
  }

  async createColumn(column: CreateColumnDto) {
    try {
      const newColumn = await this.columnsRepository.create(column);
      await this.columnsRepository.save(newColumn);
      return {
        data: newColumn,
        success: true,
        status: HttpStatus.CREATED,
      }
    } catch (e) {
      throw new HttpException("Error Service " + e, HttpStatus.BAD_REQUEST);
    }
  }

  async updateColumn(id: number, column: TUpdateColumnDto) {
    try {
      //@ts-ignore
      const updatedResult = await this.columnsRepository.update(id, column);
      if (updatedResult.affected === 0) {
        throw new HttpException("Column not found", HttpStatus.NOT_FOUND);
      }
      const updatedColumn = await this.columnsRepository.findOne({
        where: {
          id,
        }
      });
      return {
        success: true,
        data: updatedColumn,
        status: HttpStatus.OK,
      }
    } catch (e) {
      throw new HttpException("Error Service " + e, HttpStatus.BAD_REQUEST);
    }
  }
}
