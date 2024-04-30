export type Token = {
  type: Expr;
  value: string;
};

export const EXPR = {
  HEADING: "HEADING",
  COLUMN: "COLUMN",
  TASK: "TASK",
  INVALID: "INVALID",
} as const;

type ObjectValues<T> = T[keyof T];

export type Expr = ObjectValues<typeof EXPR>;

// TODO: rename this type
export type TokenPattern = {
  type: Expr;
  exprPattern: RegExp;
  valPatterns: RegExp[];
};
