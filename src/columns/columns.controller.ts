import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";

import ColumnsService from "./columns.service";
import { CreateColumnDto } from "./column.dto";
import { AuthGuard } from "@nestjs/passport";
import RolesGuard from "src/role/role.guard";

@Controller('columns')
export default class ColumnsController {
  constructor(
    private readonly columnsService: ColumnsService,
  ) {}

  @Get()
  getAllColumns() {
    return this.columnsService.getAllColumns();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  // @UseGuards(RolesGuard(['admin']))
  createColumn(@Body() columnDto: CreateColumnDto) {
    return this.columnsService.createColumn(columnDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  updateColumn(@Body() columnDto: CreateColumnDto, @Param('id') id: string) {
    return this.columnsService.updateColumn(+id, columnDto);
  }
}
