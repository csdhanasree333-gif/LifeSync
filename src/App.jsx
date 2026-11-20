import { Routes, Route, Navigate } from "react-router-dom";
import MoodPage from "./modules/mood/MoodPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/mood" replace />} />
      <Route path="/mood" element={<MoodPage />} />
    </Routes>
  );
}

export default App;