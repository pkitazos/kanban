import { Button } from "./ui/button";
import { Card, CardTitle } from "./ui/card";
import { type Id, type Task } from "@/lib/types/board";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X as XIcon } from "lucide-react";
import { useState } from "react";

export function TaskCard({
  task,
  deleteTask,
  updateTask,
}: {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, title: string) => void;
}) {
  const [mouseOver, setMouseOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseOver(false);
  };

  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className="flex h-[100px] min-h-[100px] border-accent opacity-50"
      />
    );
  }

  if (editMode) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative flex h-[100px] min-h-[100px] cursor-grab flex-row items-center p-2.5 text-left hover:ring-2 hover:ring-inset hover:ring-accent"
      >
        <textarea
          value={task.title}
          autoFocus
          placeholder="Task title goes here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter") toggleEditMode();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
          className="h-[90%] w-full resize-none border-none bg-transparent focus:outline-none"
        />
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative flex h-[100px] min-h-[100px] cursor-grab flex-row items-center p-2.5 text-left hover:ring-2 hover:ring-inset hover:ring-accent"
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      onDoubleClick={toggleEditMode}
    >
      <CardTitle className="text-base">{task.title}</CardTitle>
      {mouseOver && (
        <Button
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
          size="icon"
          variant="ghost"
          onClick={() => deleteTask(task.id)}
        >
          <XIcon className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
}
