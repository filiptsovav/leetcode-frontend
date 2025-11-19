import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import TaskChosen from "./pages/TaskChosen";
import TaskSuggestion from "./pages/TaskSuggestion"
import Statistics from "./pages/Statistics"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path= "/dashboard" element = {<Dashboard />} />
        <Route path="/tasks/chosen" element={<TaskChosen />} />
        <Route path= "/taskSuggestion" element = {<TaskSuggestion />} />
        <Route path= "/statistics" element = {<Statistics />} />
        {/* при желании можно добавить /home, /profile и т.п. */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
