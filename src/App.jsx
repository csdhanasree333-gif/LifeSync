import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TaskManagement from "./modules/tasks/TaskManagement";
import Journal from "./modules/journal/Journal";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TaskManagement />} />
      <Route path="/journal" element={<Journal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;