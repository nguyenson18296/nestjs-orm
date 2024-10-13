import { IsDate, IsNotEmpty, IsOptional, Length } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import User from "src/users/user.entity";
import Columns from "src/columns/column.entity";
import TaskLabels from "src/labels/labels.entity";

@Entity()
class Tasks {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  @IsNotEmpty()
  @Length(3, 100) // min and max length
  title: string;

  @Column("text")
  @IsOptional()
  @Length(10, 5000) // min and max length
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

  @ManyToMany(() => User)
  @JoinTable()
  assignees: User[];

  @ManyToOne(() => Columns)
  @JoinTable()
  column: Columns;

  @OneToMany(() => TaskLabels, (taskLabels) => taskLabels.id)
  taskLabels: TaskLabels[];
}
