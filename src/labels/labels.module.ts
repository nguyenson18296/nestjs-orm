import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import TaskLabels from "./labels.entity";
import LabelsController from "./labels.controller";
import LabelsService from "./labels.service";

@Module({
  imports: [TypeOrmModule.forFeature([TaskLabels])],
  controllers: [LabelsController],
  providers: [LabelsService],
})
export class LabelsModule {}
