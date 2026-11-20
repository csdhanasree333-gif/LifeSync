
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TaskManagement from "./modules/tasks/TaskManagement";
import Calendar from "./modules/Calendar/Calendar.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
