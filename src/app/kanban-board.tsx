"use client";

import { ColumnContainer } from "@/components/column-container";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";

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
  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColum] = useState<Column | null>();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 10 px
      },
    }),
  );

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-10">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnIds}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                />
              ))}
            </SortableContext>
          </div>
          <Button
            className="flex items-center gap-2"
            size="lg"
            onClick={createNewColumn}
          >
            <Plus /> Add Column
          </Button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
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

  function onDragStart({ active }: DragStartEvent) {
    console.log("DRAG START");
    if (active.data.current?.type === "Column") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setActiveColum(active.data.current.column);
      return;
    }
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over) return;

    const activeColId = active.id;
    const overColId = over.id;

    if (activeColId === overColId) return;

    setColumns((columns) => {
      const activeColIdx = findColIndex(columns, activeColId);
      const overColIdx = findColIndex(columns, overColId);

      return arrayMove(columns, activeColIdx, overColIdx);
    });
  }
}

function generateId() {
  // get actual unique id
  return Math.floor(Math.random() * 10001);
}

function findColIndex(columns: Column[], id: Id) {
  return columns.findIndex((col) => col.id === id);
}
