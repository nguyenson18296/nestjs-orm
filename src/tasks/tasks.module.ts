import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import Tasks from "./task.entity";
import Columns from "src/columns/column.entity";
import User from "src/users/user.entity";
import TasksController from "./tasks.controller";
import TasksService from "./tasks.service";
import TaskLabels from "src/labels/labels.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Tasks, TaskLabels, Columns, User])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
