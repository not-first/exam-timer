import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Check } from "lucide-react";
import { timerCreationSelector, useTimerStore } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShallow } from "zustand/react/shallow";

export default function TimerCreationScreen() {
  const [examName, setExamName] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [writingTime, setWritingTime] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { presets, addPreset, loadPreset, startTimer } = useTimerStore(
    useShallow(timerCreationSelector)
  );

  const handleSavePreset = () => {
    addPreset({
      name: examName,
      readingTime: parseInt(readingTime),
      writingTime: parseInt(writingTime),
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 1000);
  };

  const handleStartTimer = () => {
    startTimer(examName, parseInt(readingTime), parseInt(writingTime));
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <div className="w-full max-w-sm space-y-6 p-6">
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
        <div className="flex items-center gap-2">
          <Button
            className="flex-1"
            onClick={handleStartTimer}
            disabled={!examName || !readingTime || !writingTime}
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
                saveSuccess ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              variant={"outline"}
              size="icon"
              className={`absolute inset-0 transition-opacity duration-300 ${
                saveSuccess ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              disabled
            >
              <Check className="w-4 h-4 text-green-500" />
            </Button>
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
    </div>
  );
}
