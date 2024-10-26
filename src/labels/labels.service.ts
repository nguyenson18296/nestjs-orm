import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import TaskLabels from "./labels.entity";
import { ICreateLabelDto, TUpdateLabelDto } from "./labels.dto";

@Injectable()
export default class LabelsService {
  constructor(
    @InjectRepository(TaskLabels)
    private labelsRepository: Repository<TaskLabels>,
  ) {}

  async getAllLabels() {
    try {
      const labels = await this.labelsRepository.find();
      return {
        data: labels,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async getLabelById(id: string) {
    try {
      const label = await this.labelsRepository.findOne({
        where: {
          id,
        },
      });
      if (!label) {
        throw new HttpException('Label not found', HttpStatus.NOT_FOUND);
      }

      return {
        data: label,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async createLabel(label: ICreateLabelDto) {
    try {
      const newLabel = this.labelsRepository.create(label);
      await this.labelsRepository.save(newLabel);

      return {
        data: newLabel,
        success: true,
        status: HttpStatus.CREATED,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async updateLabel(id: string, label: TUpdateLabelDto) {
    try {
      const labelExist = await this.labelsRepository.findOne({
        where: {
          id,
        },
      });
      if (!labelExist) {
        throw new HttpException('Label not found', HttpStatus.NOT_FOUND);
      }

      await this.labelsRepository.update(id, label);
      return {
        data: label,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteLabel(id: string) {
    try {
      const labelExist = await this.labelsRepository.findOne({
        where: {
          id,
        },
      });
      if (!labelExist) {
        throw new HttpException('Label not found', HttpStatus.NOT_FOUND);
      }

      await this.labelsRepository.delete(id);
      return {
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }
}