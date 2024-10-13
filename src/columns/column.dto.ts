export interface CreateColumnDto {
  title: string;
  order: number;
}

export type UpdateColumnDto = Partial<CreateColumnDto>;
