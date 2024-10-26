import { IsString } from "class-validator";
import Tasks from "src/tasks/task.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class TaskLabels {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ nullable: true })
  @IsString()
  title: string;

  @Column({ nullable: true })
  @IsString()
  color: string;

  @ManyToMany(() => Tasks, task => task.labels)
  task: Tasks[];

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}

export default TaskLabels;
