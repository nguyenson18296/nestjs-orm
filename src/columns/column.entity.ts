import { IsNumber, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Columns {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsString()
  title: string;

  @Column({ unique: true })
  @IsNumber()
  order: number;
}

export default Columns;
