import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Activity } from "./activity.entity";

@Injectable()
export default class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepository: Repository<Activity>,
  ) {}

  async getActivitiesByTask(taskId: string) {
    try {
      const activities = await this.activitiesRepository.find({
        where: {
          task: {
            id: taskId,
          },
        }
      })
      return {
        data: activities,
        success: true,
        status: HttpStatus.OK,
      }
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }
}