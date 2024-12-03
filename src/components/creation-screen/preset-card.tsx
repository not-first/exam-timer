import { ExamPreset } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, GripVertical, X } from "lucide-react";
import { PresetStore, usePresetStore } from "@/lib/stores/preset-store";
import { useShallow } from "zustand/react/shallow";

interface PresetCardProps {
  preset: ExamPreset;
  isEditing?: boolean;
  isFaded?: boolean;
  isDisabled?: boolean; // Add this prop
  onEdit: (preset: ExamPreset) => void;
  onCancelEdit?: () => void;
}

// Add selector
const selector = (state: PresetStore) => ({
  deletePreset: state.deletePreset,
  loadPreset: state.loadPreset,
});

export function PresetCard({
  preset,
  isEditing,
  isFaded,
  isDisabled, // Add this prop
  onEdit,
  onCancelEdit,
}: PresetCardProps) {
  const { deletePreset, loadPreset } = usePresetStore(useShallow(selector));
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: preset.name,
    disabled: isEditing || isFaded,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : isFaded || isDisabled ? 0.4 : undefined,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`mb-2 transition-colors ${
        isDragging ? "cursor-grabbing" : "cursor-default"
      } ${
        isEditing ? "bg-accent" : isFaded || isDisabled ? "" : "hover:bg-accent"
      }`}
      onClick={
        isFaded || isDisabled ? undefined : () => loadPreset(preset.name)
      }
    >
      <CardContent className="p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 transition-opacity duration-200">
            {!isEditing && !isFaded ? (
              <button
                {...attributes}
                {...listeners}
                className={`${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </button>
            ) : (
              <GripVertical className="h-4 w-4 text-gray-400 opacity-30" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium select-none">{preset.name}</h3>
            <p className="text-xs text-muted-foreground select-none">
              {preset.readingTime}m reading • {preset.writingTime}m writing
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          {!isEditing && !isFaded && !isDisabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(preset);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          {!isFaded && !isDisabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (isEditing) {
                  onCancelEdit?.();
                } else {
                  deletePreset(preset.name);
                }
              }}
            >
              {isEditing ? (
                <X className="h-3 w-3" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
