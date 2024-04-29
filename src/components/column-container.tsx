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

export function ColumnContainer({
  column: { id, title, tasks },
  deleteColumn,
}: {
  column: Column;
  deleteColumn: (id: Id) => void;
}) {
  return (
    <Card className="h-[500px] max-h-[500px] w-[350px] bg-slate-900">
      <CardHeader className="flex-row items-center justify-between rounded-lg border-4 border-slate-900 bg-slate-950 p-3">
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
      <CardContent>{}</CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
