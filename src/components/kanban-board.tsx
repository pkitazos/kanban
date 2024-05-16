"use client";

import { ColumnContainer } from "@/components/column-container";
import { TaskCard } from "@/components/task-card";
import { Button } from "@/components/ui/button";
import { type Column, type Id, type Task } from "@/lib/types/board";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { CirclePlus as CirclePLusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";

type KanbanBoardProps = {
  initialColumns?: Column[];
  initialTasks?: Task[];
};

export function KanbanBoard({
  initialColumns = [],
  initialTasks = [],
}: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 10 px
      },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="m-auto flex gap-4">
        <div className="flex gap-4">
          <SortableContext items={columnIds}>
            {columns.map((col) => (
              <ColumnContainer
                key={col.id}
                column={col}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((t) => t.columnId === col.id)}
              />
            ))}
          </SortableContext>
        </div>
        <Button
          className="flex w-[350px] flex-row items-center justify-start gap-2.5 space-y-1.5 rounded-lg border-4 border-slate-900 bg-slate-950 px-3 py-8 text-base"
          variant="secondary"
          size="lg"
          onClick={createColumn}
        >
          <CirclePLusIcon className="h-5 w-5" /> Add Column
        </Button>
      </div>
      {createPortal(
        <DragOverlay>
          {activeColumn && (
            <ColumnContainer
              column={activeColumn}
              deleteColumn={deleteColumn}
              updateColumn={updateColumn}
              createTask={createTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
              tasks={tasks.filter((t) => t.columnId === activeColumn.id)}
            />
          )}
          {activeTask && (
            <TaskCard
              task={activeTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          )}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );

  function createColumn() {
    const newColumn: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
      order: columns.length + 1,
    };
    setColumns([...columns, newColumn]);
  }

  function deleteColumn(id: Id) {
    setColumns((prev) => prev.filter((s) => s.id !== id));

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      title: `Task ${tasks.length + 1}`,
      content: "",
      order: tasks.length + 1,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTask(id: Id, title: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, title };
    });

    setTasks(newTasks);
  }

  function onDragStart({ active }: DragStartEvent) {
    if (active.data.current?.type === "Column") {
      const selectedColumn = active.data.current.column as unknown as Column;
      setActiveColumn(selectedColumn);
      return;
    }

    if (active.data.current?.type === "Task") {
      const selectedTask = active.data.current.task as unknown as Task;
      setActiveTask(selectedTask);
      return;
    }
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    if (!over) return;

    const activeColId = active.id;
    const overColId = over.id;

    if (activeColId === overColId) return;

    setColumns((columns) => {
      const activeColIdx = findIndex(columns, activeColId);
      const overColIdx = findIndex(columns, overColId);

      // TODO: perform column reordering

      return arrayMove(columns, activeColIdx, overColIdx);
    });
  }

  function onDragOver({ active, over }: DragOverEvent) {
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    // dropping a task over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIdx = findIndex(tasks, activeId);
        const overIdx = findIndex(tasks, overId);

        tasks[activeIdx]!.columnId = tasks[overIdx]!.columnId;
        // TODO: perform task reordering

        return arrayMove(tasks, activeIdx, overIdx);
      });
    }

    const isOverColumn = over.data.current?.type === "Column";

    // dropping a task over a column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIdx = findIndex(tasks, activeId);

        tasks[activeIdx]!.columnId = overId;
        // TODO: perform task reordering

        return arrayMove(tasks, activeIdx, activeIdx);
      });
    }
  }
}

export function generateId() {
  // TODO: get actual unique id
  return Math.floor(Math.random() * 10001);
}

function findIndex<T extends { id: Id }>(data: T[], id: Id) {
  return data.findIndex((e) => e.id === id);
}
