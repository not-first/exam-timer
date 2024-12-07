import { usePresetStore, PresetStore } from "@/lib/stores/preset-store";
import { ExamPreset } from "@/lib/types";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PresetCard } from "./preset-card";
import { useShallow } from "zustand/react/shallow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";

const selector = (state: PresetStore) => ({
  presets: state.presets,
  reorderPresets: state.reorderPresets,
});

interface PresetListProps {
  editingPreset: string | null;
  isDisabled?: boolean;
  onEdit: (preset: ExamPreset) => void;
  onCancelEdit: () => void;
}

export function PresetList({
  editingPreset,
  isDisabled,
  onEdit,
  onCancelEdit,
}: PresetListProps) {
  const { presets, reorderPresets } = usePresetStore(useShallow(selector));
  const [newPresetName, setNewPresetName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const prevPresetsLength = useRef(presets.length);
  useEffect(() => {
    if (presets.length > prevPresetsLength.current) {
      setNewPresetName(presets[0].name);
      setTimeout(() => setNewPresetName(null), 500);
    }
    prevPresetsLength.current = presets.length;
  }, [presets]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = presets.findIndex((p) => p.name === active.id);
    const newIndex = presets.findIndex((p) => p.name === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      reorderPresets(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <ScrollArea className="h-80 w-full">
        <div className="p-1">
          <SortableContext
            items={presets.map((preset) => preset.name)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {presets.map((preset) => (
                <motion.div
                  key={preset.name}
                  layout={!isDragging}
                  initial={
                    preset.name === newPresetName
                      ? {
                          opacity: 0,
                          height: 0,
                          scale: 0.8,
                        }
                      : false
                  }
                  animate={{
                    opacity: 1,
                    height: "auto",
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    scale: 0.8,
                  }}
                  transition={{
                    opacity: { duration: 0.2 },
                    height: { duration: 0.2 },
                    scale: { duration: 0.2 },
                    layout: { duration: isDragging ? 0 : 0.2 },
                  }}
                >
                  <PresetCard
                    preset={preset}
                    onEdit={onEdit}
                    onCancelEdit={onCancelEdit}
                    isEditing={editingPreset === preset.name}
                    isFaded={!!editingPreset && editingPreset !== preset.name}
                    isDisabled={isDisabled}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {presets.length === 0 && (
              <Card className="mb-2 border-dashed">
                <CardContent className="p-2 flex items-center justify-center h-[50px] text-sm text-muted-foreground">
                  No presets saved
                </CardContent>
              </Card>
            )}
          </SortableContext>
        </div>
      </ScrollArea>
    </DndContext>
  );
}
