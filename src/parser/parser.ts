import { generateId, type Column, type Task } from "@/app/kanban-board";
import { COLUMN, HEADING, TASK } from "./token";
import { EXPR, type Expr, type Token, type TokenPattern } from "./type";

export function parseLine(line: string) {
  if (HEADING.exprPattern.test(line)) return getTokens(line, HEADING);
  if (COLUMN.exprPattern.test(line)) return getTokens(line, COLUMN);
  if (TASK.exprPattern.test(line)) return getTokens(line, TASK);
  return [];
}

export function getValue(line: string, pattern: RegExp) {
  const match = pattern.exec(line);
  return match?.at(0)?.trim() ?? "";
}

function getTokens(line: string, tkn: TokenPattern) {
  return tkn.valPatterns
    .map((re) => getValue(line, re))
    .map((str) => ({ type: tkn.type, value: str }));
}

export function getHeading(tokens: Token[][]) {
  if (tokens.length === 0) throw new Error("File is empty");

  const headings = tokens.filter((l) => hasType(l, EXPR.HEADING));

  if (headings.length > 1) throw new Error("More than one heading specified");
  if (headings.length === 1) return headings[0]![0]!.type;

  return "Untitled";
}

export function hasType(line: Token[], type: Expr) {
  return line.findIndex((e) => e.type === type) !== -1;
}

function makeColumn(token: Token) {
  return { id: generateId(), title: token.value };
}

function makeTask(column: Column, taskTokens: [Token, Token]) {
  return {
    id: generateId(),
    columnId: column.id,
    title: taskTokens[0].value,
    content: taskTokens[1].value,
  };
}

function getToken(line: Token[]): Token {
  if (line.length !== 1) throw new Error("Some check failed earlier");
  return line[0]!;
}

function getTokenPair(line: Token[]): [Token, Token] {
  if (line.length !== 2) throw new Error("Some check failed earlier");
  return [line[0]!, line[1]!];
}

export function generateKanban(allTokens: Token[][]) {
  const heading = getHeading(allTokens);
  const remainingTokens = allTokens.filter((l) => !hasType(l, EXPR.HEADING));

  if (remainingTokens.length === 0) {
    throw new Error("File does not contain any columns or tasks");
  }

  if (!hasType(remainingTokens[0]!, EXPR.COLUMN)) {
    throw new Error("Tasks must belong to a column");
  }

  const columns: Column[] = [];
  const tasks: Task[] = [];

  let currentColIdx = 0;
  for (const line of remainingTokens) {
    if (hasType(line, EXPR.COLUMN)) {
      const token = getToken(line);
      const newColumn = makeColumn(token);
      currentColIdx = columns.length;
      columns.push(newColumn);
      continue;
    }
    if (hasType(line, EXPR.TASK)) {
      const tokens = getTokenPair(line);
      const newTask = makeTask(columns[currentColIdx]!, tokens);
      tasks.push(newTask);
      continue;
    }
  }

  return { heading, columns, tasks };
}

export function generateTokens(lines: string[]) {
  const allTokens: Token[][] = lines
    .map((line) => {
      const tokens = parseLine(line);
      if (tokens.length !== 0) return tokens;
    })
    .filter(Boolean);

  return allTokens;
}
