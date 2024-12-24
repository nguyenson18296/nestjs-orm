import Columns from "src/columns/column.entity";
import TaskLabels from "src/labels/labels.entity";
import User from "src/users/user.entity";

export interface ICreateTaskDto {
  banner?: string;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  due_date: string;
  created_at: string;
  assignees: User[];
  column_id: number;
  labels: TaskLabels[];
}

export type TUpdateTaskDto = Partial<ICreateTaskDto> & {
  assignees_id: number[];
  labels_id: string[];
};
