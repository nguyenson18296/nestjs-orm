import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import VoucherUser from './voucher-user.entity';
import VoucherProduct from './voucher-product.entity';

@Entity()
class Voucher {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  discount_value: number;

  @Column('date', { nullable: true })
  valid_from: Date;

  @Column('date', { nullable: true })
  valid_to: Date;

  @Column('int', { default: 0 })
  usage_limit: number;

  @Column('int', { default: 0 })
  usage_count: number;

  @Column('text', { nullable: true })
  description: string;

  @Column('boolean', { default: false })
  is_active: boolean;

  @OneToMany(() => VoucherUser, (voucherUsers) => voucherUsers.voucher)
  users: VoucherUser[];

  @OneToMany(() => VoucherProduct, (product) => product.voucher)
  products: VoucherProduct[];
}

export default Voucher;
