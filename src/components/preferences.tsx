import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
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
  { value: "slate", class: "bg-slate-900 dark:bg-slate-800" },
  { value: "zinc", class: "bg-zinc-900 dark:bg-zinc-800" },
  { value: "rose", class: "bg-rose-500 dark:bg-rose-600" },
  { value: "blue", class: "bg-blue-500 dark:bg-blue-600" },
  { value: "green", class: "bg-green-500 dark:bg-green-600" },
  { value: "orange", class: "bg-orange-500 dark:bg-orange-600" },
  { value: "purple", class: "bg-purple-500 dark:bg-purple-600" },
];

const fontOptions = [
  { value: "sans", class: "font-sans", sample: "Aa" },
  { value: "serif", class: "font-serif", sample: "Aa" },
  { value: "mono", class: "font-mono", sample: "Aa" },
];

type TimerStyle = "default" | "design 2" | "name only" | "section only";

const timerStyleOptions: { value: TimerStyle; sample: React.ReactNode }[] = [
  {
    value: "default",
    sample: (
      <div className="flex flex-col items-center text-[10px] gap-0.5">
        <span className="text-muted-foreground text-[8px]">Subject</span>
        <span className="tabular-nums">00:00</span>
        <span className="text-muted-foreground text-[8px]">Section</span>
      </div>
    ),
  },
  {
    value: "design 2",
    sample: (
      <div className="flex flex-col items-center text-[10px] gap-0.5">
        <span className="tabular-nums">00:00</span>
        <div className="flex gap-1 text-[8px] text-muted-foreground">
          <span>Subject</span>
          <span>Section</span>
        </div>
      </div>
    ),
  },
  {
    value: "name only",
    sample: (
      <div className="flex flex-col items-center text-[10px] gap-0.5">
        <span className="text-muted-foreground text-[8px]">Subject</span>
        <span className="tabular-nums">00:00</span>
      </div>
    ),
  },
  {
    value: "section only",
    sample: (
      <div className="flex flex-col items-center text-[10px] gap-0.5">
        <span className="tabular-nums">00:00</span>
        <span className="text-muted-foreground text-[8px]">Section</span>
      </div>
    ),
  },
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
    <div className="grid gap-4">
      <div className="space-y-1">
        <h4 className="font-medium leading-none">Settings</h4>
      </div>
      <div className="grid gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm">Accent Colour</Label>
          <div className="flex flex-wrap gap-1.5">
            {colourOptions.map((option) => (
              <button
                key={option.value}
                className={cn(
                  `w-7 h-7 rounded-lg transition-all`,
                  option.class,
                  accentColor === option.value
                    ? "ring-2 ring-offset-2 ring-offset-background ring-ring"
                    : "hover:scale-110"
                )}
                onClick={() => setAccentColor(option.value)}
                aria-label={`Select ${option.value} accent color`}
              />
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Font</Label>
          <div className="flex gap-1.5">
            {fontOptions.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "flex-1 h-12 rounded-lg border border-input bg-background px-3 transition-all flex flex-col items-center justify-center",
                  fontFamily === option.value
                    ? "ring-2 ring-ring"
                    : "hover:bg-accent hover:text-accent-foreground",
                  option.class
                )}
                onClick={() => setFontFamily(option.value)}
                aria-label={`Select ${option.value} font`}
              >
                <div className="text-xl">{option.sample}</div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {option.value}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm">Theme</Label>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
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
          <Label htmlFor="show-progress-bar" className="text-sm">
            Progress Bar
          </Label>
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
          <Label htmlFor="timer-size" className="text-sm">
            Timer Size
          </Label>
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
        <div className="grid grid-cols-2 gap-1.5">
          {timerStyleOptions.map((option) => (
            <button
              key={option.value}
              className={cn(
                "h-16 rounded-lg border border-input bg-background transition-all flex items-center justify-center",
                timerStyle === option.value
                  ? "ring-2 ring-ring"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setTimerStyle(option.value)}
              aria-label={`Select timer style: ${option.value}`}
            >
              {option.sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
