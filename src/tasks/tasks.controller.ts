import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import TasksService from "./tasks.service";
import type { ICreateTaskDto, TUpdateTaskDto } from "./tasks.dto";

@Controller('tasks')
export default class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Get('/column/:columnId')
  getTaskByColumn(@Param('columnId') columnId: number) {
    return this.tasksService.getTaskByColumn(columnId);
  }

  @Get(':slug')
  getTaskBySlug(@Param('slug') slug: string) {
    return this.tasksService.getTaskBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createTask(@Body() taskDto: ICreateTaskDto) {
    return this.tasksService.createTask(taskDto);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  updateTask(@Param('id') id: string, @Body() taskDto: TUpdateTaskDto) {
    return this.tasksService.updateTask(id, taskDto);
  }

  @Put('/:id/remove-assignee/:assigneeId')
  @UseGuards(AuthGuard('jwt'))
  removeAssignee(@Param('id') id: string, @Param('assigneeId') assigneeId: string) {
    return this.tasksService.removeAssigneeFromTask(id, +assigneeId);
  }
}
