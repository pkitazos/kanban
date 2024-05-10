"use client";

import { KanbanBoard } from "@/components/kanban-board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateBoardData, generateTokenStream } from "@/lib/compiler";
import { writeToFile } from "@/lib/compiler/decompiler";
import { type BoardData } from "@/lib/types/token";
import { invoke } from "@tauri-apps/api";
import { useState } from "react";

export default function Home() {
  const [board, setBoard] = useState<BoardData | null>(null);

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
        const data = generateBoardData(tokenStream);

        setBoard(data);
      } else {
        setBoard(null);
      }
    };
  }

  async function handleClick() {
    await invoke("greet", { name: "World" }).then((response) =>
      console.log(response),
    );
  }

  function handleSave(data: BoardData) {
    const fileContent = writeToFile(data);
    console.log(fileContent);
  }

  return (
    <div className="flex flex-col gap-4">
      <Button disabled={!board} onClick={() => handleSave(board!)}>
        write out
      </Button>

      <Button onClick={handleClick}>greet</Button>
      <Input
        type="file"
        accept="txt"
        onChange={(e) => handleFileLoad(e.target.files)}
      />
      {board && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xl">{board.heading}</h2>
          <KanbanBoard
            initialColumns={board.columns}
            initialTasks={board.tasks}
          />
        </div>
      )}
    </div>
  );
}
