export interface CreateVoucherDto {
  code: string;
  discount_value: number;
  valid_from: Date;
  valid_to: Date;
  usage_limit: number;
  is_active: boolean;
}

export type UpdateVoucherDto = Partial<CreateVoucherDto>;

export interface CreateVoucherUserDto {
  voucher_id: string;
  user_id: number;
  usage_count: number;
}
