import "@total-typescript/ts-reset/filter-boolean";

export type Token = {
  type: ExprType;
  value: string;
};

export const EXPR = {
  HEADING: "HEADING",
  COLUMN: "COLUMN",
  TASK: "TASK",
  INVALID: "INVALID",
} as const;

type ObjectValues<T> = T[keyof T];

export type ExprType = ObjectValues<typeof EXPR>;

// TODO: rename this type
export type ExprPattern = {
  type: ExprType;
  exprPattern: RegExp;
  valPatterns: RegExp[];
};
