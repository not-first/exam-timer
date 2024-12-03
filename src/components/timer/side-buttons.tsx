import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Maximize,
  Minimize,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import PreferencesPopover from "@/components/preferences";
import { Switch } from "@/components/ui/switch";
import { usePreferencesStore } from "@/lib/stores/preferences-store";

export function MaximiseMinimiseButton({
  isFullscreen,
  toggleFullscreen,
}: {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}) {
  const [maximizeButtonVisible, setMaximizeButtonVisible] = useState(false);
  const alwaysShowIcons = usePreferencesStore((state) => state.alwaysShowIcons);

  useEffect(() => {
    if (!alwaysShowIcons) {
      setMaximizeButtonVisible(false);
    }
  }, [alwaysShowIcons]);

  return (
    <div
      className="fixed top-0 right-0 w-32 h-32 flex justify-end pt-4 pr-4"
      onMouseEnter={() => setMaximizeButtonVisible(true)}
      onMouseLeave={() => !alwaysShowIcons && setMaximizeButtonVisible(false)}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullscreen}
        className={`transition-opacity duration-300 ${
          maximizeButtonVisible || alwaysShowIcons ? "opacity-100" : "opacity-0"
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
  const alwaysShowIcons = usePreferencesStore((state) => state.alwaysShowIcons);

  useEffect(() => {
    if (!alwaysShowIcons && !isHelpOpen) {
      setHelpButtonVisible(false);
    }
  }, [alwaysShowIcons, isHelpOpen]);

  const handleHelpVisibility = useCallback(
    (isOpen: boolean) => {
      setIsHelpOpen(isOpen);
      if (!isOpen && !alwaysShowIcons) {
        setTimeout(() => setHelpButtonVisible(false), 200);
      }
    },
    [alwaysShowIcons]
  );

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
      onMouseLeave={() =>
        !isHelpOpen && !alwaysShowIcons && setHelpButtonVisible(false)
      }
    >
      <Popover onOpenChange={handleHelpVisibility}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`transition-opacity duration-300 ${
              helpButtonVisible || isHelpOpen || alwaysShowIcons
                ? "opacity-100"
                : "opacity-0"
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
  const alwaysShowIcons = usePreferencesStore((state) => state.alwaysShowIcons);

  useEffect(() => {
    if (!alwaysShowIcons && !isSettingsOpen) {
      setSettingsButtonVisible(false);
    }
  }, [alwaysShowIcons, isSettingsOpen]);

  const themeMode = usePreferencesStore((state) => state.themeMode);
  const setThemeMode = usePreferencesStore((state) => state.setThemeMode);
  const isDark = themeMode === "dark";

  const handleSettingsVisibility = useCallback(
    (isOpen: boolean) => {
      setIsSettingsOpen(isOpen);
      if (!isOpen && !alwaysShowIcons) {
        setTimeout(() => setSettingsButtonVisible(false), 200);
      }
    },
    [alwaysShowIcons]
  );

  return (
    <div
      className="fixed top-0 left-0 flex items-center pt-4 pl-4 gap-2"
      onMouseEnter={() => setSettingsButtonVisible(true)}
      onMouseLeave={() =>
        !isSettingsOpen && !alwaysShowIcons && setSettingsButtonVisible(false)
      }
    >
      <Popover onOpenChange={handleSettingsVisibility}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`transition-opacity duration-300 ${
              settingsButtonVisible || isSettingsOpen || alwaysShowIcons
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
      <div
        className={`flex items-center gap-2 transition-opacity duration-300 ${
          settingsButtonVisible || isSettingsOpen || alwaysShowIcons
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        <Switch
          checked={isDark}
          onCheckedChange={(checked) =>
            setThemeMode(checked ? "dark" : "light")
          }
        />
      </div>
    </div>
  );
}
