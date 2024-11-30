import { useCallback, useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import {
  FastForward,
  MoreVertical,
  Pause,
  Play,
  RotateCcw,
  X,
  ToggleLeft,
  ArrowLeft,
  HelpCircle,
  Minimize,
  Maximize,
} from "lucide-react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShallow } from "zustand/react/shallow";

import { examTimerSelector, useTimerStore } from "@/lib/store";

export default function ExamTimer() {
  const [showSeconds, setShowSeconds] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [helpButtonVisible, setHelpButtonVisible] = useState(false);
  const [maximizeButtonVisible, setMaximizeButtonVisible] = useState(false);
  const {
    examName,
    currentSection,
    readingTime,
    writingTime,
    timeRemaining,
    isRunning,
    toggleTimer,
    skipSection,
    restartSection,
    exitTimer,
    goBack,
  } = useTimerStore(useShallow(examTimerSelector));

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      useTimerStore.setState((state) => {
        const newTime = state.timerState.timeRemaining - 1;
        if (newTime < 0) {
          if (state.timerState.currentSection === "reading") {
            return {
              timerState: {
                ...state.timerState,
                currentSection: "writing",
                timeRemaining: state.timerState.writingTime * 60,
                isRunning: false,
              },
            };
          }
          return {
            timerState: {
              ...state.timerState,
              currentSection: "completed",
              timeRemaining: 0,
              isRunning: false,
            },
          };
        }
        return {
          timerState: {
            ...state.timerState,
            timeRemaining: newTime,
          },
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const showButtons = useCallback(() => {
    setButtonsVisible(true);
    if (isRunning) {
      const timer = setTimeout(() => setButtonsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isRunning]);

  function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return showSeconds
      ? `${hours.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${hours.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}`;
  }

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          e.preventDefault();
          toggleTimer();
          break;
        case "Escape":
          exitTimer();
          break;
        case "n":
          skipSection();
          break;
        case "r":
          restartSection();
          break;
        case "s":
          setShowSeconds(!showSeconds);
          break;
        case "b":
          if (currentSection === "writing") goBack();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    exitTimer,
    restartSection,
    showSeconds,
    skipSection,
    toggleTimer,
    goBack,
    currentSection,
    toggleFullscreen,
  ]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const shortcuts = [
    { key: "Space", action: "Play/Pause Timer" },
    { key: "Esc", action: "Exit Timer" },
    { key: "N", action: "Next Section" },
    { key: "R", action: "Restart Section" },
    { key: "S", action: "Toggle Seconds" },
    { key: "B", action: "Back to Reading (Writing only)" },
    { key: "F", action: "Toggle Fullscreen" },
  ];

  const totalTime =
    currentSection === "reading" ? readingTime * 60 : writingTime * 60;
  const elapsedTime = totalTime - timeRemaining;
  const progress = (elapsedTime / totalTime) * 100;

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed top-0 right-0 w-32 h-32 flex justify-end pt-4 pr-4"
        onMouseEnter={() => setMaximizeButtonVisible(true)}
        onMouseLeave={() => setMaximizeButtonVisible(false)}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className={`transition-opacity duration-300 ${
            maximizeButtonVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex min-h-screen items-center justify-center font-sans">
        <div
          className="flex flex-col items-center space-y-4"
          onMouseEnter={showButtons}
          onMouseMove={showButtons}
        >
          <p className="text-sm text-muted-foreground">{examName}</p>
          <p className="text-6xl font-light tabular-nums tracking-tight">
            {formatTime(timeRemaining)}
          </p>
          <Progress value={progress} className="h-1" />
          <p className="text-sm text-muted-foreground capitalize">
            {currentSection} Time
          </p>
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
        </div>
      </div>

      <div
        className="fixed bottom-0 right-0 w-32 h-32 flex items-end justify-end pb-4 pr-4"
        onMouseEnter={() => setHelpButtonVisible(true)}
        onMouseLeave={() => setHelpButtonVisible(false)}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowHelp(true)}
          className={`transition-opacity duration-300 ${
            helpButtonVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {shortcuts.map(({ key, action }) => (
              <div key={key} className="flex justify-between gap-4">
                <kbd className="px-2 py-1 bg-muted rounded">{key}</kbd>
                <span className="text-sm">{action}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
