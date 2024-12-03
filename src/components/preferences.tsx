import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import {
  PreferencesStore,
  usePreferencesStore,
} from "@/lib/stores/preferences-store";
import { useShallow } from "zustand/react/shallow";
import { Separator } from "@/components/ui/separator";

const preferencesSelector = (state: PreferencesStore) => ({
  themeMode: state.themeMode,
  showProgressBar: state.showProgressBar,
  alwaysShowIcons: state.alwaysShowIcons,
  timerSize: state.timerSize,
  setThemeMode: state.setThemeMode,
  toggleProgressBar: state.toggleProgressBar,
  toggleIcons: state.toggleIcons,
  setTimerSize: state.setTimerSize,
  showSeconds: state.showSeconds,
  toggleSeconds: state.toggleSeconds,
  alwaysShowActions: state.alwaysShowActions,
  toggleActions: state.toggleActions,
});

export default function PreferencesPopover() {
  const preferences = usePreferencesStore(useShallow(preferencesSelector));

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="always-show-icons" className="text-sm">
          Always Show Icons
        </Label>
        <Switch
          id="always-show-icons"
          checked={preferences.alwaysShowIcons}
          onCheckedChange={preferences.toggleIcons}
        />
      </div>

      <Separator className="my-1" />

      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-seconds" className="text-sm">
            Show Seconds
          </Label>
          <Switch
            id="show-seconds"
            checked={preferences.showSeconds}
            onCheckedChange={preferences.toggleSeconds}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="always-show-actions" className="text-sm">
            Always Show Timer Actions
          </Label>
          <Switch
            id="always-show-actions"
            checked={preferences.alwaysShowActions}
            onCheckedChange={preferences.toggleActions}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-progress-bar" className="text-sm">
            Progress Bar
          </Label>
          <Switch
            id="show-progress-bar"
            checked={preferences.showProgressBar}
            onCheckedChange={preferences.toggleProgressBar}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="timer-size" className="text-sm">
            Timer Size
          </Label>
          <Slider
            id="timer-size"
            min={0}
            max={100}
            step={1}
            defaultValue={[50]}
            value={[preferences.timerSize]}
            onValueChange={(value) => preferences.setTimerSize(value[0])}
            className="pt-1"
          />
        </div>
      </div>
    </div>
  );
}
