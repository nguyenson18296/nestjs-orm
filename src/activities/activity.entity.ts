import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Tasks from 'src/tasks/task.entity';
import User from 'src/users/user.entity';
import { Length } from 'class-validator';

export enum ActivityType {
  COMMENT = 'COMMENT',
  ATTACHMENT = 'ATTACHMENT',
  UNASSIGN = 'UNASSIGN',
  ASSIGN = 'ASSIGN',
  STATUS_CHANGE = 'STATUS_CHANGE',
}

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tasks, (task) => task.activities, { onDelete: 'CASCADE' })
  task: Tasks;

  @ManyToOne(() => User, (user) => user.activities, { nullable: true })
  user: User;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  type: ActivityType;

  @Column({ type: 'text', nullable: true })
  @Length(3, 5000)
  details: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
