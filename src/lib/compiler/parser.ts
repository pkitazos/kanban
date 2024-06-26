import { generateId } from "@/components/kanban-board";
import {
  COLUMN,
  HEADING,
  TASK,
  checkType,
  type BoardData,
  type Column,
  type Task,
  type Token,
} from "@/lib/types";

// TODO: make more informative syntactic error messages (include line number, line content, and more descriptive message)

export function generateBoardData(allTokens: Token[][]): BoardData {
  if (allTokens.length === 0) throw new Error("File is empty");

  const heading = getHeading(allTokens);
  const remainingTokens = allTokens.filter((x) => !checkType(x, HEADING.type));

  if (remainingTokens.length === 0) {
    throw new Error("File does not contain any columns or tasks");
  }

  if (!checkType(remainingTokens[0]!, COLUMN.type)) {
    throw new Error("Tasks must belong to a column");
  }

  const columns: Column[] = [];
  const tasks: Task[] = [];

  let currentColIdx = 0;
  let taskOrder = 0;
  for (const line of remainingTokens) {
    if (checkType(line, COLUMN.type)) {
      currentColIdx = columns.length;
      const token = getToken(line);
      const newColumn = makeColumn(token, currentColIdx + 1);
      columns.push(newColumn);
      taskOrder = 0;
      continue;
    }
    if (checkType(line, TASK.type)) {
      const tokens = getTokenPair(line);
      const newTask = makeTask(columns[currentColIdx]!, tokens, taskOrder);
      tasks.push(newTask);
      taskOrder += 1;
      continue;
    }
  }

  return { heading, columns, tasks };
}

export function getHeading(tokens: Token[][]): string {
  const headings = tokens.filter((x) => checkType(x, HEADING.type));

  if (headings.length > 1) throw new Error("More than one heading specified");
  if (headings.length === 1) return headings[0]![0]!.value;

  return "Untitled";
}

function getToken(line: Token[]): Token {
  if (line.length !== 1) throw new Error("Some check failed earlier");
  return line[0]!;
}

function getTokenPair(line: Token[]): [Token, Token] {
  if (line.length !== 2) throw new Error("Some check failed earlier");
  return [line[0]!, line[1]!];
}

function makeColumn(token: Token, order: number): Column {
  return { id: generateId(), title: token.value, order };
}

function makeTask(
  column: Column,
  taskTokens: [Token, Token],
  order: number,
): Task {
  return {
    id: generateId(),
    columnId: column.id,
    title: taskTokens[0].value,
    content: taskTokens[1].value,
    order,
  };
}
