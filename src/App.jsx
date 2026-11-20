import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TaskManagement from "./modules/tasks/TaskManagement";
import HabitTracker from "./modules/habits/HabitTracker";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/habits" element={<HabitTracker />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
