import { Moon, Settings, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import {
  PreferencesStore,
  usePreferencesStore,
} from "@/lib/stores/preferences-store";
import { useShallow } from "zustand/react/shallow";

const selector = (state: PreferencesStore) => ({
  accentColor: state.accentColor,
  fontFamily: state.fontFamily,
  themeMode: state.themeMode,
  showProgressBar: state.showProgressBar,
  alwaysShowIcons: state.alwaysShowIcons,
  timerSize: state.timerSize,
  timerStyle: state.timerStyle,
  setAccentColor: state.setAccentColor,
  setFontFamily: state.setFontFamily,
  setThemeMode: state.setThemeMode,
  setShowProgressBar: state.setShowProgressBar,
  setAlwaysShowIcons: state.setAlwaysShowIcons,
  setTimerSize: state.setTimerSize,
  setTimerStyle: state.setTimerStyle,
});

const colourOptions = [
  { value: "#6e6e6e", class: "bg-[#6e6e6e]" },
  { value: "pink", class: "bg-[#FFB6C1]" },
  { value: "orange", class: "bg-[#FFB347]" },
  { value: "yellow", class: "bg-[#FFE66D]" },
  { value: "lime", class: "bg-[#B4FF9F]" },
  { value: "cyan", class: "bg-[#9FFFFF]" },
  { value: "purple", class: "bg-[#E0B0FF]" },
  { value: "blue", class: "bg-[#87CEEB]" },
];

const fontOptions = [
  { value: "sans", class: "font-sans", sample: "Aa" },
  { value: "serif", class: "font-serif", sample: "Aa" },
  { value: "mono", class: "font-mono", sample: "Aa" },
];

type TimerStyle = "default" | "design 2" | "name only" | "section only";

const timerStyleOptions: { value: TimerStyle; sample: string }[] = [
  { value: "default", sample: "Name 00:00 Section" },
  { value: "design 2", sample: "00:00 Name Section" },
  { value: "name only", sample: "Name" },
  { value: "section only", sample: "Section" },
];

export default function PreferencesPopover() {
  const {
    accentColor,
    fontFamily,
    themeMode,
    showProgressBar,
    alwaysShowIcons,
    timerSize,
    timerStyle,
    setAccentColor,
    setFontFamily,
    setThemeMode,
    setShowProgressBar,
    setAlwaysShowIcons,
    setTimerSize,
    setTimerStyle,
  } = usePreferencesStore(useShallow(selector));

  const isDark = themeMode === "dark";

  return (
    <div className="p-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px]" align="start" side="bottom">
          <div className="grid gap-4">
            <div className="space-y-1">
              <h4 className="font-medium leading-none">Settings</h4>
            </div>
            <div className="grid gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Accent Colour</Label>
                <div className="flex flex-wrap gap-1.5">
                  {colourOptions.map((option) => (
                    <Button
                      key={option.value}
                      className={cn(
                        `w-7 h-7 rounded-lg transition-all`,
                        option.class,
                        accentColor === option.value
                          ? "ring-2 ring-offset-2 ring-offset-background ring-ring"
                          : "hover:scale-110"
                      )}
                      onClick={() => setAccentColor(option.value)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Font</Label>
                <div className="flex gap-1.5">
                  {fontOptions.map((option) => (
                    <Button
                      key={option.value}
                      className={cn(
                        "flex-1 h-12 rounded-lg border border-input bg-background px-3 py-2 text-sm transition-all",
                        fontFamily === option.value
                          ? "ring-2 ring-ring"
                          : "hover:bg-accent hover:text-accent-foreground",
                        option.value === "sans" && "font-sans",
                        option.value === "serif" && "font-serif",
                        option.value === "mono" && "font-mono"
                      )}
                      onClick={() => setFontFamily(option.value)}
                    >
                      <div className="font-bold text-base">{option.sample}</div>
                      <div className="text-xs">{option.value}</div>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Theme</Label>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setThemeMode(isDark ? "light" : "dark")}
                >
                  {isDark ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Progress Bar</Label>
                <Switch
                  id="show-progress-bar"
                  checked={showProgressBar}
                  onCheckedChange={setShowProgressBar}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Preset List</Label>
                <Switch
                  id="show-preset-list"
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Always Show Icons</Label>
                <Switch
                  id="always-show-icons"
                  checked={alwaysShowIcons}
                  onCheckedChange={setAlwaysShowIcons}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Timer Size</Label>
              </div>
              <Slider
                id="timer-size"
                min={0}
                max={100}
                step={1}
                value={[timerSize]}
                onValueChange={(value) => setTimerSize(value[0])}
                className="pt-1"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Timer Style</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {timerStyleOptions.map((option) => (
                  <Button
                    key={option.value}
                    className={cn(
                      "h-16 rounded-lg border border-input bg-background px-2 py-1 text-xs transition-all",
                      timerStyle === option.value
                        ? "ring-2 ring-ring"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setTimerStyle(option.value)}
                  >
                    <div className="font-bold text-base">{option.sample}</div>
                    <div className="text-xs">{option.value}</div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
