import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Image {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public asset_id: string;

  @Column()
  public url: string;
}

export default Image;
