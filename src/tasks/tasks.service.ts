import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Tasks from './task.entity';
import { ICreateTaskDto, TUpdateTaskDto } from './tasks.dto';
import Columns from 'src/columns/column.entity';
import User from 'src/users/user.entity';
import { generateSlug } from 'src/utils/utils';
import TaskLabels from 'src/labels/labels.entity';

@Injectable()
export default class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private tasksRepository: Repository<Tasks>,
    @InjectRepository(Columns)
    private columnsRepository: Repository<Columns>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(TaskLabels)
    private labelsRepository: Repository<TaskLabels>,
  ) {}

  async getAllTasks() {
    try {
      const tasksQueryBuilder = this.tasksRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.column', 'column') // Including related 'column'
        .leftJoinAndSelect('task.assignees', 'assignee') // Including related 'assignees'
        .leftJoinAndSelect('task.labels', 'label') // Including related 'labels'

      const [tasks, total] = await Promise.all([
        tasksQueryBuilder.getMany(),
        this.tasksRepository.createQueryBuilder('task').getCount(), // Total count without filters
      ]);

      return {
        data: tasks,
        total,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async getTaskByColumn(columnId: number) {
    try {
      const result = await this.tasksRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.assignees', 'assignee')
        .select([
          'task.id', // Select specific fields from task
          'task.title',
          'task.slug',
          'task.banner',
          'task.start_date',
          'task.due_date',
          'assignee.id', // Select specific fields from assignee
          'assignee.username', // Only fetch the 'name' field from the assignees
          'assignee.email', // Assuming you also want the email
          'assignee.avatar', // Assuming you also want the avatar
        ])
        .leftJoinAndSelect('task.labels', 'label')
        .where('task.column_id = :columnId', { columnId }) // Make sure your column relation is correctly referenced
        .getMany();

      return {
        data: result,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async getTaskBySlug(slug: string) {
    try {
      const result = await this.tasksRepository.findOne({
        where: {
          slug,
        },
        relations: ['assignees', 'labels'],
      });
      if (!result) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      return {
        data: result,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async createTask(task: ICreateTaskDto) {
    try {
      const data: ICreateTaskDto = {
        ...task,
        slug: generateSlug(task.title),
      };
      const newTask = await this.tasksRepository.create(data);
      await this.tasksRepository.save(newTask);
      return {
        data: newTask,
        success: true,
        status: HttpStatus.CREATED,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async updateTask(id: string, task: TUpdateTaskDto) {
    try {
      const taskExist = await this.tasksRepository.findOne({
        where: {
          id,
        },
      });
      if (!taskExist) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      const columnExist = await this.columnsRepository.findOne({
        where: {
          id: task.column_id,
        },
      });
      if (!columnExist) {
        throw new HttpException('Column not found', HttpStatus.NOT_FOUND);
      }
      if (task.assignees_id) {
        const assignees = await Promise.all(
          task.assignees_id.map(async (id) => {
            const user = await this.usersRepository.findOne({
              where: {
                id,
              },
            });
            if (!user) {
              throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return user;
          }),
        )
        task.assignees = assignees;
      }

      if (task.labels_id) {
        const labels = await Promise.all(
          task.labels_id.map(async (label) => {
            const labelExist = await this.labelsRepository.findOne({
              where: {
                id: label,
              },
            });
            if (!labelExist) {
              throw new HttpException('Label not found', HttpStatus.NOT_FOUND);
            }
            return labelExist;
          }),
        );
        task.labels = labels
      }

      const updatedResult = await this.tasksRepository.save({
        ...taskExist,
        banner: task.banner ? task.banner : taskExist.banner,
        assignees: task.assignees,
        labels: task.labels,
        description: task.description ? task.description : taskExist.description,
        slug: task.title ? generateSlug(task.title) : taskExist.slug,
        start_date: task.start_date ? task.start_date : taskExist.start_date,
        due_date: task.due_date ? task.due_date : taskExist.due_date,
      });
      return {
        success: true,
        data: updatedResult,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async removeAssigneeFromTask(taskId: string, assigneeId: number) {
    try {
      return await this.tasksRepository.manager.transaction(
        async (entityManager) => {
          // Find the task by UUID
          const task = await entityManager.findOne(Tasks, {
            where: { id: taskId }, // Task ID is a UUID (string)
            relations: ['assignees'], // Load related assignees
          });

          if (!task) {
            throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
          }

          // Find the assignee by integer ID
          const assignee = await entityManager.findOne(User, {
            where: { id: assigneeId }, // Assignee ID is an integer
          });

          if (!assignee) {
            throw new HttpException('Assignee not found', HttpStatus.NOT_FOUND);
          }

          // Remove the assignee from the task's assignees
          task.assignees = task.assignees.filter((a) => a.id !== assigneeId);

          // Save the updated task with modified assignees
          await entityManager.save(task);

          return {
            data: task,
            success: true,
            status: HttpStatus.OK,
          };
        },
      );
    } catch (e) {
      throw new HttpException(
        'Error Service ' + e.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
