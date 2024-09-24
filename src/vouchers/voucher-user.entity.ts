import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import Voucher from './voucher.entity';
import User from '../users/user.entity';

@Entity()
class VoucherUser {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => Voucher, (voucher) => voucher)
  @JoinColumn({ name: 'voucher_id' })
  voucher: Voucher;

  @ManyToOne(() => User, (user) => user.vouchers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  usage_count: number;
}

export default VoucherUser;
