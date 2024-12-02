import ExamTimer from "@/components/exam-timer";
import TimerCreationScreen from "@/components/timer-creation";
import "./index.css";
import { Toaster } from "sonner";
import {
  useNavigationStore,
  NavigationStore,
} from "@/lib/stores/navigation-store";
import { useShallow } from "zustand/react/shallow";

const selector = (state: NavigationStore) => state.page;
function App() {
  const page = useNavigationStore(useShallow(selector));

  return (
    <>
      {page === "home" ? <TimerCreationScreen /> : <ExamTimer />}
      <Toaster />
    </>
  );
}

export default App;
