import { IsDate, IsNotEmpty, IsOptional, Length } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import User from "src/users/user.entity";
import Columns from "src/columns/column.entity";
import TaskLabels from "src/labels/labels.entity";

@Entity()
class Tasks {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ nullable: true })
  @IsOptional()
  banner: string;

  @Column()
  @IsNotEmpty()
  @Length(3, 100) // min and max length
  title: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  @Length(3, 100) // min and max length
  slug: string;

  @Column("text", { nullable: true })
  @Length(10, 5000) // min and max length
  @IsOptional()
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsDate()
  @IsOptional()
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsDate()
  @IsOptional()
  due_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @ManyToMany(() => User, users => users.tasks)
  @JoinTable({
    name: 'user_tasks',
    joinColumn: {
      name: 'task_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    }
  })
  assignees: User[];

  @ManyToOne(() => Columns, columns => columns.id, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'column_id' })
  @IsNotEmpty()
  column: Columns;

  @OneToMany(() => TaskLabels, (taskLabels) => taskLabels.id)
  taskLabels: TaskLabels[];
}

export default Tasks;
