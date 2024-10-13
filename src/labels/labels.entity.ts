import { IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class TaskLabels {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  color: string;
}

export default TaskLabels;
