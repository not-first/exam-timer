import {
  MaximiseMinimiseButton,
  ShortcutsButton,
  SettingsButton,
} from "../timer/side-buttons";
import { useFullscreen } from "@/hooks/use-fullscreen";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <div className="relative min-h-screen">
      <SettingsButton />
      <MaximiseMinimiseButton
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />
      {children}
      <ShortcutsButton />
    </div>
  );
}
