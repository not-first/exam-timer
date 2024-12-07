import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, Check, PenLine } from "lucide-react";
import { useTimerStore } from "@/lib/stores/timer-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { AppLayout } from "./layouts/app-layout";
import { usePresetStore } from "@/lib/stores/preset-store";
import { useNavigationStore } from "@/lib/stores/navigation-store";
import { Separator } from "@/components/ui/separator";
import { PresetList } from "./creation-screen/preset-list";
import { toast } from "sonner";
import { ExamPreset } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TimerStore } from "@/lib/stores/timer-store";
import { PresetStore } from "@/lib/stores/preset-store";
import { NavigationStore } from "@/lib/stores/navigation-store";
import { useShallow } from "zustand/react/shallow";
import { motion, AnimatePresence } from "motion/react";

const validateTimerInputs = (
  examName: string,
  readingTime: string,
  writingTime: string
) => {
  const errors: string[] = [];

  if (!examName.trim()) {
    errors.push("Exam name is required");
  } else if (examName.length > 50) {
    errors.push("Exam name must be 50 characters or less");
  }

  const readingMins = parseInt(readingTime);
  const writingMins = parseInt(writingTime);

  if (isNaN(readingMins) || readingMins < 0 || readingMins > 300) {
    errors.push("Reading time must be between 0-300 minutes");
  }

  if (isNaN(writingMins) || writingMins < 0 || writingMins > 300) {
    errors.push("Writing time must be between 0-300 minutes");
  }

  return errors;
};

const isInteger = (value: string) => {
  return /^\d*$/.test(value);
};

const timerSelector = (state: TimerStore) => ({
  startTimer: state.startTimer,
});

const presetSelector = (state: PresetStore) => ({
  presets: state.presets,
  addPreset: state.addPreset,
  loadPreset: state.loadPreset,
  updatePreset: state.updatePreset,
});

const navigationSelector = (state: NavigationStore) => ({
  setPage: state.setPage,
});

export default function TimerCreationScreen() {
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [examName, setExamName] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [writingTime, setWritingTime] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [originalPreset, setOriginalPreset] = useState<ExamPreset | null>(null);
  const [presetListShown, setPresetListShown] = useState(true);
  const [isPresetLoaded, setIsPresetLoaded] = useState(false);
  const [isDuplicateName, setIsDuplicateName] = useState(false);

  const { startTimer } = useTimerStore(useShallow(timerSelector));
  const { presets, addPreset, loadPreset, updatePreset } = usePresetStore(
    useShallow(presetSelector)
  );
  const { setPage } = useNavigationStore(useShallow(navigationSelector));

  useEffect(() => {
    if (!examName || examName === editingPreset) {
      setIsDuplicateName(false);
      return;
    }
    const duplicateExists = presets.some(
      (p) => p.name === examName && p.name !== editingPreset
    );
    setIsDuplicateName(duplicateExists);
  }, [examName, presets, editingPreset]);

  const handleSavePreset = () => {
    const validationErrors = validateTimerInputs(
      examName,
      readingTime,
      writingTime
    );

    if (validationErrors.length > 0) {
      toast.error("Invalid input", {
        description: validationErrors.join(". "),
      });
      return;
    }

    if (editingPreset) {
      updatePreset(editingPreset, {
        name: examName,
        readingTime: parseInt(readingTime),
        writingTime: parseInt(writingTime),
      });
      setEditingPreset(null);
    } else {
      addPreset({
        name: examName,
        readingTime: parseInt(readingTime),
        writingTime: parseInt(writingTime),
      });
    }

    // Reset form after successful save
    setExamName("");
    setReadingTime("");
    setWritingTime("");
    setSelectedPreset("");
    setIsPresetLoaded(false);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 1000);
  };

  const handleStartTimer = () => {
    const validationErrors = validateTimerInputs(
      examName,
      readingTime,
      writingTime
    );

    if (validationErrors.length > 0) {
      toast.error("Invalid input", {
        description: validationErrors.join(". "),
      });
      return;
    }

    const timerName = isPresetLoaded ? selectedPreset : examName;
    startTimer(timerName, parseInt(readingTime), parseInt(writingTime));

    setTimeout(() => {
      setPage("timer");
    }, 0);
  };

  const handleEditPreset = (preset: ExamPreset) => {
    setOriginalPreset(preset);
    setEditingPreset(preset.name);
    setExamName(preset.name);
    setReadingTime(preset.readingTime.toString());
    setWritingTime(preset.writingTime.toString());
  };

  const handleCancelEdit = () => {
    const hasChanges =
      originalPreset &&
      (examName !== originalPreset.name ||
        parseInt(readingTime) !== originalPreset.readingTime ||
        parseInt(writingTime) !== originalPreset.writingTime);

    if (hasChanges) {
      setShowCancelDialog(true);
    } else {
      resetEditState();
    }
  };

  const resetEditState = () => {
    setEditingPreset(null);
    setOriginalPreset(null);
    setExamName("");
    setReadingTime("");
    setWritingTime("");
  };

  const handleSelectChange = (value: string) => {
    if (value === "show-presets") {
      setPresetListShown(true);
    } else if (value === "none") {
      setSelectedPreset("");
      setIsPresetLoaded(false);
      setExamName("");
      setReadingTime("");
      setWritingTime("");
    } else {
      const preset = loadPreset(value);
      if (preset) {
        setSelectedPreset(value);
        setIsPresetLoaded(true);
        setExamName(preset.name);
        setReadingTime(preset.readingTime.toString());
        setWritingTime(preset.writingTime.toString());
      }
    }
  };

  const handleReadingTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isInteger(value) || value === "") {
      setReadingTime(value);
    }
  };

  const handleWritingTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isInteger(value) || value === "") {
      setWritingTime(value);
    }
  };

  return (
    <AppLayout>
      <div className="flex h-screen items-center justify-center font-sans">
        <div
          className="flex relative overflow-hidden bg-background transition-[width] duration-500 ease-in-out"
          style={{
            width: presetListShown ? "770px" : "350px",
            marginLeft: presetListShown ? "0px" : "0px", // Changed from -20px to 0px
          }}
        >
          <motion.div
            animate={{
              x: presetListShown ? -5 : 0, // Changed from -10 to -5
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 25,
            }}
            className="w-[350px] bg-background p-6 relative z-20"
          >
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="examName">Exam Name</Label>
                <Input
                  id="examName"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value.slice(0, 50))}
                  disabled={isPresetLoaded}
                  maxLength={50}
                  placeholder="Enter exam name"
                />
                <AnimatePresence mode="sync">
                  {(examName.length > 45 || isDuplicateName) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.2 },
                        opacity: { duration: 0.2 },
                      }}
                    >
                      {isDuplicateName ? (
                        <p className="text-xs text-destructive">
                          A preset with this name already exists
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {50 - examName.length} characters remaining
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="readingTime">Reading Time (minutes)</Label>
                <Input
                  id="readingTime"
                  type="number"
                  min={0}
                  max={300}
                  value={readingTime}
                  onChange={handleReadingTimeChange}
                  disabled={isPresetLoaded}
                  placeholder="Enter reading time"
                  onKeyDown={(e) => {
                    if (e.key === "." || e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="writingTime">Writing Time (minutes)</Label>
                <Input
                  id="writingTime"
                  type="number"
                  min={0}
                  max={300}
                  value={writingTime}
                  onChange={handleWritingTimeChange}
                  disabled={isPresetLoaded}
                  placeholder="Enter writing time"
                  onKeyDown={(e) => {
                    if (e.key === "." || e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  className="flex-1"
                  onClick={handleStartTimer}
                  disabled={
                    !examName ||
                    !readingTime ||
                    !writingTime ||
                    Boolean(editingPreset) ||
                    isDuplicateName
                  }
                >
                  Start Timer
                </Button>
                <div className="relative w-10 h-10">
                  <Button
                    variant={"outline"}
                    size="icon"
                    onClick={handleSavePreset}
                    disabled={
                      !examName ||
                      !readingTime ||
                      !writingTime ||
                      isPresetLoaded ||
                      isDuplicateName
                    }
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      saveSuccess
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100"
                    }`}
                  >
                    {editingPreset ? (
                      <PenLine className="w-4 h-4" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                  </Button>
                  {saveSuccess && (
                    <Button
                      variant={"outline"}
                      size="icon"
                      className="absolute inset-0 transition-opacity duration-300"
                      disabled
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </Button>
                  )}
                </div>
                <Select
                  value={selectedPreset}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Load Preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectSeparator />
                    {presets.map((preset: ExamPreset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.name}
                      </SelectItem>
                    ))}
                    {!presetListShown && (
                      <>
                        <SelectSeparator />
                        <SelectItem value="show-presets">
                          Manage Presets
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="sync">
            {presetListShown && (
              <>
                <motion.div
                  className="absolute inset-y-6 cursor-pointer hover:bg-muted/50 w-[20px] z-30 bg-background"
                  style={{ left: "350px" }}
                  animate={{ x: -20 }}
                  initial={{ x: 0 }}
                  exit={{
                    x: 0,
                    opacity: 0,
                    transition: {
                      duration: 0.15, // Quick fade out
                      opacity: { duration: 0.1 }, // Even quicker opacity fade
                    },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                  }}
                  onClick={() => setPresetListShown(false)}
                >
                  <Separator
                    orientation="vertical"
                    className="h-full mx-auto"
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -340 }}
                  animate={{ x: 340 }} // Changed from 350 to 365
                  exit={{ x: -340 }}
                  transition={{
                    type: "spring",
                    stiffness: 200, // Higher stiffness for faster initial movement
                    damping: 20, // Lower damping for more bounce
                    mass: 0.7, // Lower mass for lighter feel
                    restDelta: 0.5, // Makes it settle more quickly
                  }}
                  className="absolute left-0 w-[400px] bg-background p-6 z-10"
                >
                  <PresetList
                    editingPreset={editingPreset}
                    isDisabled={isPresetLoaded}
                    onEdit={handleEditPreset}
                    onCancelEdit={handleCancelEdit}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Editing?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to cancel editing?
              Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={resetEditState}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
