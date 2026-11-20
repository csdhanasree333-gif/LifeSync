import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TaskManagement from "./modules/tasks/TaskManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TaskManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;