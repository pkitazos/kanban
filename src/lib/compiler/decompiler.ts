import { type BoardData, type Column, type Task } from "@/lib/types/board";

export function writeToFile(data: BoardData) {
  const { heading, columns, tasks } = data;

  const lines = [
    headingToString(heading),
    ...columns.flatMap((col) => [
      columnToString(col),
      ...tasks.filter((t) => t.columnId === col.id).map(taskToString),
    ]),
  ];

  return lines.join("\n");
}

function headingToString(heading: string) {
  return `# ${heading}`;
}

function columnToString(column: Column) {
  return `- ${column.title}`;
}

function taskToString(task: Task) {
  return `\t- ${task.title} : ${task.content}`;
}
