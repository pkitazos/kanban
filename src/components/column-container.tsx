import { X } from "lucide-react";
import { Button } from "./ui/button";
import { type Id, type Column } from "@/app/kanban-board";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function ColumnContainer({
  column,
  deleteColumn,
}: {
  column: Column;
  deleteColumn: (id: Id) => void;
}) {
  const { id, title, tasks } = column;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "Column",
      column,
    },
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
      className="h-[500px] max-h-[500px] w-[350px] bg-slate-900"
    >
      <CardHeader
        className="flex-row items-center justify-between rounded-lg border-4 border-slate-900 bg-slate-950 p-3"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-slate-900 px-3.5 py-2">
            {tasks.length}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <Button size="icon" variant="ghost" onClick={() => deleteColumn(id)}>
          <X />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow">content</CardContent>
      <CardFooter>footer</CardFooter>
    </Card>
  );
}
