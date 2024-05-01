import { HEADING, COLUMN, TASK } from "./token";
import { type Token, type ExprPattern } from "./type";

export function getExprVal(line: string, pattern: RegExp) {
  const match = pattern.exec(line);
  return match?.at(0)?.trim() ?? "";
}

export function getExprToken(line: string, tkn: ExprPattern): Token[] {
  return tkn.valPatterns
    .map((re) => getExprVal(line, re))
    .map((str) => ({ type: tkn.type, value: str }));
}

export function tokenizeLine(line: string): Token[] {
  if (HEADING.exprPattern.test(line)) return getExprToken(line, HEADING);
  if (COLUMN.exprPattern.test(line)) return getExprToken(line, COLUMN);
  if (TASK.exprPattern.test(line)) return getExprToken(line, TASK);
  return [];
}

export function generateTokenStream(lines: string[]): Token[][] {
  const tokenStream: Token[][] = lines
    .map((line) => {
      const tokens = tokenizeLine(line);
      if (tokens.length !== 0) return tokens;
    })
    .filter(Boolean);

  return tokenStream;
}
