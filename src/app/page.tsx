"use client";

import { KanbanBoard } from "@/components/kanban-board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateBoardData, generateTokenStream } from "@/lib/compiler";
import { type Column, type Task } from "@/lib/types";
import { invoke } from "@tauri-apps/api";
import { useState } from "react";

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

        const tokenStream = generateTokenStream(lines);
        const { heading, columns, tasks } = generateBoardData(tokenStream);

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

  async function handleClick() {
    await invoke("greet", { name: "World" }).then((response) =>
      console.log(response),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={handleClick}>hello</Button>
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
