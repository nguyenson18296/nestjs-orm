import { TPaymentStatus } from '../order.entity';

interface IProductInfo {
  id: number;
  quantity: number;
}

export class CreateOrderDto {
  order_number: string;
  issued_date: Date;
  line_items: IProductInfo[];
  payment_status: TPaymentStatus;
  buyer_info: number;
  contact_detail: {
    address: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
}
