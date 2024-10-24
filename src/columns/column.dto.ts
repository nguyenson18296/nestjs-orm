export interface CreateColumnDto {
  title: string;
  order: number;
}

export type TUpdateColumnDto = Partial<CreateColumnDto>;
