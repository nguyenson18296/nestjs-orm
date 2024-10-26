export interface ICreateLabelDto {
  title: string;
  color: string;
}

export type TUpdateLabelDto = Partial<ICreateLabelDto>;
