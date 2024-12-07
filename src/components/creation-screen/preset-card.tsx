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
  isDisabled?: boolean;
  onEdit: (preset: ExamPreset) => void;
  onCancelEdit?: () => void;
}

const selector = (state: PresetStore) => ({
  deletePreset: state.deletePreset,
  loadPreset: state.loadPreset,
});

export function PresetCard({
  preset,
  isEditing,
  isFaded,
  isDisabled,
  onEdit,
  onCancelEdit,
}: PresetCardProps) {
  const { deletePreset } = usePresetStore(useShallow(selector));
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: preset.name,
    disabled: isEditing || isFaded || isDisabled,
  });

  console.log("🎯 PresetCard Render:", {
    name: preset.name,
    isDragging,
    isDisabled: isEditing || isFaded || isDisabled,
    hasListeners: !!listeners,
    transform,
  });

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        zIndex: isDragging ? 50 : undefined,
        position: isDragging ? "relative" : undefined,
      }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`mb-2 select-none ${
        isEditing ? "bg-accent" : isFaded || isDisabled ? "opacity-40" : ""
      } ${isDragging ? "opacity-75" : ""}`}
    >
      <CardContent className="p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className={`w-4 touch-none ${
              isEditing || isFaded || isDisabled
                ? "cursor-default"
                : "cursor-grab"
            } ${isDragging ? "cursor-grabbing" : ""}`}
          >
            <GripVertical
              className={`h-4 w-4 ${
                isEditing || isFaded || isDisabled
                  ? "text-gray-400/30"
                  : "text-gray-400"
              }`}
            />
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
