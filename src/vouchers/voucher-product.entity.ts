import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import Voucher from "./voucher.entity";
import Product from "src/products/product.entity";

@Entity()
class VoucherProduct {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => Voucher, (voucher) => voucher)
  voucher: Voucher;

  @ManyToOne(() => Product, (product) => product.vouchers)
  product: Product;
}

export default VoucherProduct;
