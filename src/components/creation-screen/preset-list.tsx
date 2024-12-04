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
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";

const selector = (state: PresetStore) => ({
  presets: state.presets,
  reorderPresets: state.reorderPresets,
  deletePreset: state.deletePreset,
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [newlyCreatedPreset, setNewlyCreatedPreset] = useState<string | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);

  const prevPresetsLengthRef = useRef(presets.length);
  useEffect(() => {
    if (presets.length > prevPresetsLengthRef.current) {
      const newPreset = presets[0];
      setNewlyCreatedPreset(newPreset.name);
      setTimeout(() => setNewlyCreatedPreset(null), 1000);
    }
    prevPresetsLengthRef.current = presets.length;
  }, [presets]);

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
    setIsMounted(true);
  }, []);

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
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setIsDragging(false);
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
      <div className="pointer-events-none absolute inset-x-0 h-80 z-10">
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
      <ScrollArea className="h-80 w-full">
        <div className="pr-4">
          <div ref={topSentinelRef} className="h-[1px] w-full" />
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <div className="relative">
              <SortableContext
                items={presets.map((preset) => preset.name)}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence mode="popLayout">
                  {presets.map((preset) => (
                    <motion.div
                      key={preset.name}
                      layout={!isDragging}
                      initial={
                        isMounted &&
                        (preset.name === newlyCreatedPreset ||
                          presets.length === 1)
                          ? { height: 0, opacity: 0, scale: 0.95 }
                          : false
                      }
                      animate={{
                        height: "auto",
                        opacity: 1,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          mass: 1,
                          height: { duration: 0.15 },
                          opacity: { duration: 0.1 },
                        },
                      }}
                      exit={
                        !isDragging
                          ? {
                              height: 0,
                              opacity: 0,
                              scale: 0.95,
                              transition: {
                                duration: 0.15,
                                ease: "easeInOut",
                              },
                            }
                          : undefined
                      }
                      style={{ position: "relative" }}
                    >
                      <PresetCard
                        preset={preset}
                        onEdit={onEdit}
                        onCancelEdit={onCancelEdit}
                        isEditing={editingPreset === preset.name}
                        isFaded={
                          !!editingPreset && editingPreset !== preset.name
                        }
                        isDisabled={isDisabled}
                      />
                    </motion.div>
                  ))}
                  {presets.length === 0 && (
                    <motion.div
                      key="empty-state"
                      initial={false}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="mb-2 border-dashed">
                        <CardContent className="p-2 flex items-center justify-center h-[50px] text-sm text-muted-foreground">
                          No presets saved
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
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
