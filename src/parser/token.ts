import { type TokenPattern, EXPR } from "./type";

// check if a line matches a particular expression
const _HEADING_EXP = /^#+\s(.+)$/;
const _COLUMN_EXP = /^-\s+(.+)$/;
const _TASK_EXP = /^(\s+)-\s+(.+)(:\s*(.+))?$/;

// extract text values from a particular sub-expression
const _HEADING_VAL = /(?<=^#\s+)(.+)(?=$)/;
const _COLUMN_TITLE = /(?<=^-\s+)(.+)(?=$)/;
const _TASK_TITLE = /(?<=^\s+-\s+)([^:]+)(?=\s*:\s*(.+)?$)?/;
const _TASK_CONTENT = /(?<=^(\s+)-\s+(.+\S)\s*:\s*)(\S.+)(?=$)/;

export const HEADING: TokenPattern = {
  type: EXPR.HEADING,
  exprPattern: _HEADING_EXP,
  valPatterns: [_HEADING_VAL],
};

export const COLUMN: TokenPattern = {
  type: EXPR.COLUMN,
  exprPattern: _COLUMN_EXP,
  valPatterns: [_COLUMN_TITLE],
};

export const TASK: TokenPattern = {
  type: EXPR.TASK,
  exprPattern: _TASK_EXP,
  valPatterns: [_TASK_TITLE, _TASK_CONTENT],
};
