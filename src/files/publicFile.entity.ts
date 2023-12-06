import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class PublicFile {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public url: string;

  @Column()
  public key: string;
}

export default PublicFile;
