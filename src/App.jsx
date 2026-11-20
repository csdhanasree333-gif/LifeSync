import { Routes, Route, Navigate } from "react-router-dom";

import TaskManagement from "./modules/tasks/TaskManagement";
import MoodPage from "./modules/mood/MoodPage";

function App() {
  return (
    <Routes>
      {/* Default homepage */}
      <Route path="/" element={<Navigate to="/tasks" replace />} />

      {/* Task Management Module */}
      <Route path="/tasks" element={<TaskManagement />} />

      {/* Mood Tracker Module */}
      <Route path="/mood" element={<MoodPage />} />
    </Routes>
  );
}

export default App;