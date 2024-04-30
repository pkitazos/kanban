"use client";
import { Input } from "@/components/ui/input";
import { generateKanban, generateTokens } from "@/parser/parser";
import { useState } from "react";
import { KanbanBoard, type Column, type Task } from "./kanban-board";

export default function Home() {
  const [board, setBoard] = useState(false);
  const [heading, setHeading] = useState("Untitled");
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  function handleFileLoad(files: FileList | null) {
    if (!files) return;

    const reader = new FileReader();
    // TODO: create different board for each file
    reader.readAsText(files[0]!);

    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        const lines = text.split("\n");

        const allTokens = generateTokens(lines);
        const { heading, columns, tasks } = generateKanban(allTokens);

        setHeading(heading);
        setColumns(columns);
        setTasks(tasks);
        setBoard(true);
      } else {
        setHeading("Untitled");
        setColumns([]);
        setTasks([]);
        setBoard(false);
      }
    };
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="file"
        accept="txt"
        onChange={(e) => handleFileLoad(e.target.files)}
      />
      {board && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xl">{heading}</h2>
          <KanbanBoard initialColumns={columns} initialTasks={tasks} />
        </div>
      )}
    </div>
  );
}
