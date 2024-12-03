import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HelpCircle, Maximize, Minimize, Settings } from "lucide-react";
import { useCallback, useState } from "react";
import PreferencesPopover from "@/components/preferences";

export function MaximiseMinimiseButton({
  isFullscreen,
  toggleFullscreen,
}: {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}) {
  const [maximizeButtonVisible, setMaximizeButtonVisible] = useState(false);

  return (
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
  );
}

export function ShortcutsButton() {
  const [helpButtonVisible, setHelpButtonVisible] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleHelpVisibility = useCallback((isOpen: boolean) => {
    setIsHelpOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => setHelpButtonVisible(false), 200);
    }
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

  return (
    <div
      className="fixed bottom-0 right-0 w-32 h-32 flex items-end justify-end pb-4 pr-4"
      onMouseEnter={() => setHelpButtonVisible(true)}
      onMouseLeave={() => !isHelpOpen && setHelpButtonVisible(false)}
    >
      <Popover onOpenChange={handleHelpVisibility}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`transition-opacity duration-300 ${
              helpButtonVisible || isHelpOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end" side="top">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">Keyboard Shortcuts</h4>
            </div>
            <div className="grid gap-2">
              {shortcuts.map(({ key, action }) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-1 px-2 rounded hover:bg-muted"
                >
                  <span className="text-sm text-muted-foreground">
                    {action}
                  </span>
                  <kbd className="px-2 py-0.5 text-xs bg-background border rounded-md shadow-sm">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function SettingsButton() {
  const [settingsButtonVisible, setSettingsButtonVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSettingsVisibility = useCallback((isOpen: boolean) => {
    setIsSettingsOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => setSettingsButtonVisible(false), 200);
    }
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-32 h-32 flex justify-start pt-4 pl-4"
      onMouseEnter={() => setSettingsButtonVisible(true)}
      onMouseLeave={() => !isSettingsOpen && setSettingsButtonVisible(false)}
    >
      <Popover onOpenChange={handleSettingsVisibility}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`transition-opacity duration-300 ${
              settingsButtonVisible || isSettingsOpen
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-4" align="start" side="bottom">
          <PreferencesPopover />
        </PopoverContent>
      </Popover>
    </div>
  );
}
