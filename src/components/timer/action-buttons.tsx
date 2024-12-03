import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { examTimerSelector, useTimerStore } from "@/lib/stores/timer-store";
import {
  FastForward,
  MoreVertical,
  Pause,
  Play,
  RotateCcw,
  X,
  ArrowLeft,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";

interface ActionButtonsProps {
  buttonsVisible: boolean;
  onExitRequest: () => void;
}

export function ActionButtons({
  buttonsVisible,
  onExitRequest,
}: ActionButtonsProps) {
  const {
    currentSection,
    isRunning,
    toggleTimer,
    skipSection,
    restartSection,
    goBack,
  } = useTimerStore(useShallow(examTimerSelector));

  return (
    <div
      className={`flex items-center gap-2 transition-opacity duration-300 mt-4 ${
        buttonsVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Button variant={"outline"} size={"icon"} onClick={toggleTimer}>
        {currentSection === "completed" ? (
          <X className="w-4 h-4" />
        ) : isRunning ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {currentSection === "writing" && (
            <DropdownMenuItem onClick={goBack}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Reading
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={skipSection}>
            <FastForward className="mr-2 w-4 h-4" />
            Skip Section
          </DropdownMenuItem>
          <DropdownMenuItem onClick={restartSection}>
            <RotateCcw className="mr-2 w-4 h-4" />
            Restart Section
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExitRequest}>
            <X className="mr-2 w-4 h-4" />
            Exit Timer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
