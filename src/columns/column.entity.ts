import { IsNumber, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Columns {
  @PrimaryGeneratedColumn()
  public id: string;
  
  @Column()
  @IsString()
  title: string;

  @Column()
  @IsNumber()
  order: number;
}

export default Columns;
