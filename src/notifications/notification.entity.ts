import User from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  type: string;

  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @Column()
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;
}
