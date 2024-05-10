export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
  order: number;
};

export type Task = {
  id: Id;
  columnId: Id;
  title: string;
  content: string;
  order: number;
};

export type BoardData = {
  heading: string;
  columns: Column[];
  tasks: Task[];
};
