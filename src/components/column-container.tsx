import { TaskCard } from "./task-card";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { type Column, type Id, type Task } from "@/lib/types/board";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CirclePlus as CirclePlusIcon, X as XIcon } from "lucide-react";
import { useMemo, useState } from "react";

export function ColumnContainer({
  column,
  tasks,
  deleteColumn,
  updateColumn,
  createTask,
  deleteTask,
  updateTask,
}: {
  column: Column;
  tasks: Task[];
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, title: string) => void;
}) {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging)
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className="h-[500px] max-h-[500px] w-[350px] border-2 border-accent bg-slate-900 opacity-50"
      />
    );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="flex h-[500px] max-h-[500px] w-[350px] flex-col bg-slate-900"
    >
      <CardHeader
        className="flex-row items-center justify-between rounded-lg border-4 border-slate-900 bg-slate-950 p-3"
        {...attributes}
        {...listeners}
        onDoubleClick={() => setEditMode(true)}
      >
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-slate-900 px-3.5 py-2">
            {tasks.length}
          </div>
          {!editMode && (
            <CardTitle className="text-lg">{column.title}</CardTitle>
          )}
          {editMode && (
            <Input
              className="text-lg"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => deleteColumn(column.id)}
        >
          <XIcon />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-4 overflow-y-auto overflow-x-hidden p-2">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </CardContent>
      <CardFooter className="p-2">
        <Button
          className="flex w-full items-center justify-start gap-2 px-3 py-8"
          size="lg"
          variant="ghost"
          onClick={() => {
            createTask(column.id);
          }}
        >
          <CirclePlusIcon className="h-4 w-4" />
          Add Task
        </Button>
      </CardFooter>
    </Card>
  );
}
