"use client";

import { ColumnContainer } from "@/components/column-container";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
  tasks: Task[];
};

type Task = {
  title: string;
  action: string;
};

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);

  console.log(columns);

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-10">
      <div className="m-auto flex gap-4">
        <div className="flex gap-4">
          {columns.map((col) => (
            <ColumnContainer
              key={col.id}
              column={col}
              deleteColumn={deleteColumn}
            />
          ))}
        </div>
        <Button
          className="flex items-center gap-2"
          size="lg"
          onClick={createNewColumn}
        >
          <Plus /> Add Column
        </Button>
      </div>
    </div>
  );

  function createNewColumn() {
    const newColumn: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
      tasks: [],
    };
    setColumns([...columns, newColumn]);
  }

  function deleteColumn(id: Id) {
    setColumns((prev) => prev.filter((s) => s.id !== id));
  }
}

function generateId() {
  return Math.floor(Math.random() * 10001);
}
