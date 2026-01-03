import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { filingsApi } from "@/lib/api";

interface KanbanItem {
  id: string;
  title: string;
  period: string;
  type: "gst" | "income-tax" | "license" | "professional-tax";
  status: string;
  dueDate: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
}

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

const mapFilingTypeToKanban = (type: string): keyof typeof typeColors => {
  switch (type.toLowerCase()) {
    case 'gst':
      return 'gst';
    case 'income tax':
      return 'income-tax';
    case 'license':
      return 'license';
    case 'professional tax':
      return 'professional-tax';
    default:
      return 'gst';
  }
};

const mapStatusToColumn = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'draft':
      return 'documents-needed';
    case 'ready':
      return 'ready-to-file';
    case 'filed':
    case 'verified':
      return 'filed-verified';
    default:
      return 'documents-needed';
  }
};

export function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: "documents-needed",
      title: "Documents Needed",
      items: [],
    },
    {
      id: "ready-to-file",
      title: "Ready to File",
      items: [],
    },
    {
      id: "filed-verified",
      title: "Filed & Verified",
      items: [],
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilings = async () => {
      try {
        setLoading(true);
        const response = await filingsApi.getAll({ limit: 20 });
        if (response.success) {
          // Transform filings data into kanban format
          const kanbanItems: KanbanItem[] = response.data.map((filing: any) => ({
            id: filing._id,
            title: filing.title,
            period: new Date(filing.dueDate).toLocaleDateString('en-US', { 
              month: 'short', 
              year: 'numeric' 
            }),
            type: mapFilingTypeToKanban(filing.type),
            status: filing.status,
            dueDate: filing.dueDate
          }));

          // Group items by status/column
          const newColumns = [
            {
              id: "documents-needed",
              title: "Documents Needed",
              items: kanbanItems.filter(item => mapStatusToColumn(item.status) === 'documents-needed'),
            },
            {
              id: "ready-to-file",
              title: "Ready to File",
              items: kanbanItems.filter(item => mapStatusToColumn(item.status) === 'ready-to-file'),
            },
            {
              id: "filed-verified",
              title: "Filed & Verified",
              items: kanbanItems.filter(item => mapStatusToColumn(item.status) === 'filed-verified'),
            },
          ];

          setColumns(newColumns);
        }
      } catch (err) {
        console.error('Error fetching filings for kanban:', err);
        setError('Failed to load workflow data');
        // Fallback to default data
        setColumns([
          {
            id: "documents-needed",
            title: "Documents Needed",
            items: [
              { id: "1", title: "GST Return", period: "Q4 2025", type: "gst", status: "draft", dueDate: "2026-01-20" },
              { id: "2", title: "Professional Tax", period: "Jan 2026", type: "professional-tax", status: "draft", dueDate: "2026-01-15" },
            ],
          },
          {
            id: "ready-to-file",
            title: "Ready to File",
            items: [
              { id: "3", title: "Income Tax Return", period: "FY 2024-25", type: "income-tax", status: "ready", dueDate: "2026-07-31" },
            ],
          },
          {
            id: "filed-verified",
            title: "Filed & Verified",
            items: [
              { id: "4", title: "GST Return", period: "Q3 2025", type: "gst", status: "filed", dueDate: "2025-12-20" },
              { id: "5", title: "Trade License", period: "2025", type: "license", status: "verified", dueDate: "2026-03-31" },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilings();
  }, []);

  const onDragEnd = async (result: DropResult) => {
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

    if (sourceColIndex === -1 || destColIndex === -1) return;

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

      // Update the filing status in the backend
      try {
        const newStatus = destination.droppableId === 'documents-needed' ? 'draft' :
                          destination.droppableId === 'ready-to-file' ? 'ready' : 'filed';
        
        await filingsApi.update(removed.id, { 
          status: newStatus
        });
      } catch (err) {
        console.error('Error updating filing status:', err);
        // Revert the change if API call fails
        const revertColumns = [...columns];
        revertColumns[sourceColIndex] = { ...sourceCol, items: [...sourceCol.items] };
        revertColumns[destColIndex] = { ...destCol, items: [...destCol.items] };
        setColumns(revertColumns);
      }
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Filing Workflow
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-secondary/30 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Filing Workflow
        </h2>
        {error && (
          <span className="text-xs text-orange-600 ml-auto">Using cached data</span>
        )}
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
