import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import Columns from "./column.entity";
import { CreateColumnDto } from "./column.dto";

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
      console.log('column', column);
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
}
