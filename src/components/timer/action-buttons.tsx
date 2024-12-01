import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { examTimerSelector, useTimerStore } from "@/lib/store";
import {
  FastForward,
  MoreVertical,
  Pause,
  Play,
  RotateCcw,
  X,
  ToggleLeft,
  ArrowLeft,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";

interface ActionButtonsProps {
  showSeconds: boolean;
  setShowSeconds: (show: boolean) => void;
  buttonsVisible: boolean;
}

export function ActionButtons({
  showSeconds,
  setShowSeconds,
  buttonsVisible,
}: ActionButtonsProps) {
  const {
    currentSection,
    isRunning,
    toggleTimer,
    skipSection,
    restartSection,
    exitTimer,
    goBack,
  } = useTimerStore(useShallow(examTimerSelector));

  return (
    <div
      className={`flex items-center gap-2 transition-opacity duration-300 ${
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
          <DropdownMenuItem onClick={exitTimer}>
            <X className="mr-2 w-4 h-4" />
            Exit Timer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowSeconds(!showSeconds)}>
            <ToggleLeft className="mr-2 w-4 h-4" />
            {showSeconds ? "Hide" : "Show"} Seconds
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
