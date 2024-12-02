import { useState } from "react";
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

export default function TimerCreationScreen() {
  const [examName, setExamName] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [writingTime, setWritingTime] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [originalPreset, setOriginalPreset] = useState<ExamPreset | null>(null);

  const { startTimer } = useTimerStore();
  const { presets, addPreset, loadPreset, updatePreset } = usePresetStore();
  const { setPage } = useNavigationStore();

  const handleSavePreset = () => {
    if (editingPreset) {
      updatePreset(editingPreset, {
        name: examName,
        readingTime: parseInt(readingTime),
        writingTime: parseInt(writingTime),
      });
      setEditingPreset(null);
    } else {
      const existingPreset = presets.find((p) => p.name === examName);
      if (existingPreset) {
        toast.info(
          "A preset with this name already exists. Please choose a unique name."
        );
        return;
      }

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
    startTimer(examName, parseInt(readingTime), parseInt(writingTime));
    setPage("timer");
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

  return (
    <>
      <AppLayout>
        <div className="flex h-screen items-center justify-center font-sans">
          <div className="flex h-[500px] w-full max-w-4xl gap-6 p-6">
            <div className="w-[350px] pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="examName">Exam Name</Label>
                  <Input
                    id="examName"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="readingTime">Reading Time (minutes)</Label>
                  <Input
                    id="readingTime"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    placeholder="Enter reading time"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="writingTime">Writing Time (minutes)</Label>
                  <Input
                    id="writingTime"
                    value={writingTime}
                    onChange={(e) => setWritingTime(e.target.value)}
                    placeholder="Enter writing time"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-6">
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
                    disabled={!examName || !readingTime || !writingTime}
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
                <Select onValueChange={loadPreset}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Load Preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {presets.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator orientation="vertical" className="h-full" />

            <div className="flex-1 pt-4">
              <PresetList
                editingPreset={editingPreset}
                onEdit={handleEditPreset}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          </div>
        </div>
      </AppLayout>

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
    </>
  );
}
