import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import LabelsService from './labels.service';
import { AuthGuard } from '@nestjs/passport';
import { ICreateLabelDto } from './labels.dto';

@Controller('labels')
export default class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Get()
  getAllLabels() {
    return this.labelsService.getAllLabels();
  }

  @Get('/:id')
  getLabelById(@Param('id') id: string) {
    return this.labelsService.getLabelById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createLabel(@Body() labelDto: ICreateLabelDto) {
    return this.labelsService.createLabel(labelDto);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  updateLabel(@Body() labelDto: ICreateLabelDto, @Param('id') id: string) {
    return this.labelsService.updateLabel(id, labelDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteLabel(@Param('id') id: string) {
    return this.labelsService.deleteLabel(id);
  }
}
