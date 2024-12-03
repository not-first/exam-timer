import ExamTimer from "@/components/exam-timer";
import TimerCreationScreen from "@/components/timer-creation";
import "./index.css";
import { Toaster } from "sonner";
import { useNavigationStore } from "@/lib/stores/navigation-store";
import { usePreferencesStore } from "@/lib/stores/preferences-store";
import { useEffect } from "react";

function App() {
  const page = useNavigationStore((state) => state.page);
  const themeMode = usePreferencesStore((state) => state.themeMode);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(themeMode);
  }, [themeMode]);

  return (
    <>
      {page === "home" ? <TimerCreationScreen /> : <ExamTimer />}
      <Toaster />
    </>
  );
}

export default App;
