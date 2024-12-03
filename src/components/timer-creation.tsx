import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Check, PenLine } from "lucide-react"; // Add ChevronRight import
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
  // Add state for dropdown value
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

  const { startTimer } = useTimerStore(useShallow(timerSelector));
  const { presets, addPreset, loadPreset, updatePreset } = usePresetStore(
    useShallow(presetSelector)
  );
  const { setPage } = useNavigationStore(useShallow(navigationSelector));

  const handleSavePreset = () => {
    const existingPreset = presets.find(
      (p) => p.name === examName && p.name !== editingPreset
    );

    if (existingPreset) {
      toast.info(
        "A preset with this name already exists. Please choose a unique name."
      );
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
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 1000);
  };

  const handleStartTimer = () => {
    // First start the timer
    const timerName = isPresetLoaded ? selectedPreset : examName;
    startTimer(timerName, parseInt(readingTime), parseInt(writingTime));

    // Then explicitly navigate using a slight delay to ensure timer is set
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

  return (
    <AppLayout>
      <div className="flex h-screen items-center justify-center font-sans">
        <div className="flex">
          {/* Form */}
          <div className="w-[350px] bg-background p-6">
            {/* Form inputs with reduced spacing */}
            <div className="space-y-3">
              {" "}
              {/* Reduced from space-y-4 */}
              <div className="space-y-1.5">
                {" "}
                {/* Reduced from space-y-2 */}
                <Label htmlFor="examName">Exam Name</Label>
                <Input
                  id="examName"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  disabled={isPresetLoaded}
                />
              </div>
              <div className="space-y-1.5">
                {" "}
                {/* Reduced from space-y-2 */}
                <Label htmlFor="readingTime">Reading Time (minutes)</Label>
                <Input
                  id="readingTime"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  disabled={isPresetLoaded}
                  placeholder="Enter reading time"
                />
              </div>
              <div className="space-y-1.5">
                {" "}
                {/* Reduced from space-y-2 */}
                <Label htmlFor="writingTime">Writing Time (minutes)</Label>
                <Input
                  id="writingTime"
                  value={writingTime}
                  onChange={(e) => setWritingTime(e.target.value)}
                  disabled={isPresetLoaded}
                  placeholder="Enter writing time"
                />
              </div>
              {/* Buttons with reduced top margin */}
              <div className="flex items-center gap-2 pt-2">
                {" "}
                {/* Reduced from mt-6 */}
                <Button
                  className="flex-1"
                  onClick={handleStartTimer}
                  disabled={
                    !examName ||
                    !readingTime ||
                    !writingTime ||
                    Boolean(editingPreset)
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
                      isPresetLoaded
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
          </div>

          {/* Separator */}
          {presetListShown && (
            <div
              className="w-[20px] flex items-stretch cursor-pointer hover:bg-muted/50 py-3 rounded-lg"
              onClick={() => setPresetListShown(false)}
            >
              <Separator
                orientation="vertical"
                className="mx-auto bg-border/80"
              />
            </div>
          )}

          {/* Preset List - adjust to match form height */}
          {presetListShown && (
            <div className="w-[400px] bg-background p-6">
              <PresetList
                editingPreset={editingPreset}
                isDisabled={isPresetLoaded}  // Add this prop
                onEdit={handleEditPreset}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          )}
        </div>
      </div>

      {/* Alert Dialog */}
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
