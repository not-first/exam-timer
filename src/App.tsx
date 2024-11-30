import ExamTimer from "@/components/exam-timer";
import TimerCreationScreen from "@/components/timer-creation";
import "./index.css";
import { useTimerStore, TimerStore } from "@/lib/store";
import { useEffect } from "react";

const selector = (state: TimerStore) => state.page;
function App() {
  const page = useTimerStore(selector);

  useEffect(() => {
    console.log(page);
  }, [page]);

  return <>{page === "home" ? <TimerCreationScreen /> : <ExamTimer />}</>;
}

export default App;
