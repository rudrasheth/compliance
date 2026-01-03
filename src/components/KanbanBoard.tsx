import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KanbanItem {
  id: string;
  title: string;
  period: string;
  type: "gst" | "income-tax" | "license" | "professional-tax";
}

interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
}

const initialColumns: KanbanColumn[] = [
  {
    id: "documents-needed",
    title: "Documents Needed",
    items: [
      { id: "1", title: "GST Return", period: "Q4 2025", type: "gst" },
      { id: "2", title: "Professional Tax", period: "Jan 2026", type: "professional-tax" },
    ],
  },
  {
    id: "ready-to-file",
    title: "Ready to File",
    items: [
      { id: "3", title: "Income Tax Return", period: "FY 2024-25", type: "income-tax" },
    ],
  },
  {
    id: "filed-verified",
    title: "Filed & Verified",
    items: [
      { id: "4", title: "GST Return", period: "Q3 2025", type: "gst" },
      { id: "5", title: "Trade License", period: "2025", type: "license" },
    ],
  },
];

const typeColors = {
  gst: "bg-neon-green/10 text-neon-green border-neon-green/30",
  "income-tax": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  license: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  "professional-tax": "bg-neon-orange/10 text-neon-orange border-neon-orange/30",
};

const typeLabels = {
  gst: "GST",
  "income-tax": "IT",
  license: "LIC",
  "professional-tax": "PT",
};

export function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColIndex = columns.findIndex((col) => col.id === source.droppableId);
    const destColIndex = columns.findIndex((col) => col.id === destination.droppableId);

    const sourceCol = columns[sourceColIndex];
    const destCol = columns[destColIndex];

    const sourceItems = [...sourceCol.items];
    const destItems = source.droppableId === destination.droppableId
      ? sourceItems
      : [...destCol.items];

    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      const newColumns = [...columns];
      newColumns[sourceColIndex] = { ...sourceCol, items: sourceItems };
      setColumns(newColumns);
    } else {
      destItems.splice(destination.index, 0, removed);
      const newColumns = [...columns];
      newColumns[sourceColIndex] = { ...sourceCol, items: sourceItems };
      newColumns[destColIndex] = { ...destCol, items: destItems };
      setColumns(newColumns);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Filing Workflow
        </h2>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column, colIndex) => (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                {colIndex === 0 && <AlertCircle className="w-4 h-4 text-neon-orange" />}
                {colIndex === 1 && <FileText className="w-4 h-4 text-blue-400" />}
                {colIndex === 2 && <CheckCircle2 className="w-4 h-4 text-neon-green" />}
                <h3 className="text-xs font-medium text-foreground">{column.title}</h3>
                <Badge variant="secondary" className="text-xs ml-auto">
                  {column.items.length}
                </Badge>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 min-h-[200px] p-2 rounded-lg border border-dashed transition-colors",
                      snapshot.isDraggingOver
                        ? "border-primary/50 bg-primary/5"
                        : "border-border bg-surface-sunken"
                    )}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "p-3 mb-2 rounded-md border bg-card cursor-grab active:cursor-grabbing transition-all",
                              snapshot.isDragging
                                ? "border-primary shadow-lg shadow-primary/20"
                                : "border-border hover:border-primary/30"
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {item.title}
                                </p>
                                <p className="text-xs font-mono text-muted-foreground mt-0.5">
                                  {item.period}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn("text-[10px] shrink-0", typeColors[item.type])}
                              >
                                {typeLabels[item.type]}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
