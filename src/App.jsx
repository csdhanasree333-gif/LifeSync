import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TaskManagement from "./modules/tasks/TaskManagement";
import GoalManagement from "./modules/goals/GoalManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/goals" element={<GoalManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;