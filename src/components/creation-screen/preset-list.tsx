import { usePresetStore, PresetStore } from "@/lib/stores/preset-store";
import { ExamPreset } from "@/lib/types";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PresetCard } from "./preset-card";
import { useShallow } from "zustand/react/shallow";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const selector = (state: PresetStore) => ({
  presets: state.presets,
  reorderPresets: state.reorderPresets,
  deletePreset: state.deletePreset,
});

interface PresetListProps {
  editingPreset: string | null;
  onEdit: (preset: ExamPreset) => void;
  onCancelEdit: () => void;
}

export function PresetList({
  editingPreset,
  onEdit,
  onCancelEdit,
}: PresetListProps) {
  const { presets, reorderPresets } = usePresetStore(useShallow(selector));
  const [activeId, setActiveId] = useState<string | null>(null);

  // Modify sensor to prevent dragging during edit mode
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: editingPreset ? Infinity : 0,
      },
    })
  );

  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topObserver = new IntersectionObserver(
      ([entry]) => {
        setIsAtTop(entry.isIntersecting);
      },
      { threshold: 1 }
    );

    const bottomObserver = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry.isIntersecting);
      },
      { threshold: 1 }
    );

    if (topSentinelRef.current) {
      topObserver.observe(topSentinelRef.current);
    }
    if (bottomSentinelRef.current) {
      bottomObserver.observe(bottomSentinelRef.current);
    }

    return () => {
      topObserver.disconnect();
      bottomObserver.disconnect();
    };
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    if (editingPreset) return;
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = presets.findIndex((p) => p.name === active.id);
    const newIndex = presets.findIndex((p) => p.name === over.id);

    reorderPresets(oldIndex, newIndex);
  };

  const activePreset = activeId
    ? presets.find((p) => p.name === activeId)
    : null;

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-x-0 h-[420px] z-10">
        <div
          className={`absolute top-0 h-8 w-full bg-gradient-to-b from-background to-transparent transition-opacity duration-200 ${
            isAtTop ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          className={`absolute bottom-0 h-8 w-full bg-gradient-to-t from-background to-transparent transition-opacity duration-200 ${
            isAtBottom ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
      <ScrollArea className="h-[420px] w-full">
        <div className="pr-4">
          <div ref={topSentinelRef} className="h-[1px] w-full" />
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <div className="space-y-2">
              <SortableContext
                items={presets.map((preset) => preset.name)}
                strategy={verticalListSortingStrategy}
              >
                {presets.map((preset) => (
                  <PresetCard
                    key={preset.name}
                    preset={preset}
                    onEdit={onEdit}
                    onCancelEdit={onCancelEdit}
                    isEditing={editingPreset === preset.name}
                    isFaded={!!editingPreset && editingPreset !== preset.name}
                  />
                ))}
              </SortableContext>
            </div>

            <DragOverlay>
              {activePreset ? (
                <PresetCard
                  preset={activePreset}
                  onEdit={() => {}}
                  isEditing={false}
                  isFaded={false}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
          <div ref={bottomSentinelRef} className="h-[1px] w-full" />
        </div>
      </ScrollArea>
    </div>
  );
}
