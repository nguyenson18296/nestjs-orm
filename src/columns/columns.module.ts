import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Columns from './column.entity';
import ColumnsController from './columns.controller';
import ColumnsService from './columns.service';

@Module({
  imports: [TypeOrmModule.forFeature([Columns])],
  controllers: [ColumnsController],
  providers: [ColumnsService],
})
export class ColumnsModule {}
