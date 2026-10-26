import { useQuery } from "@tanstack/react-query";
import "./App.css";
import Task from "./task";
import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Dashboard from "./pages/dashboard/Dashboard";
import { ProtectedRoute } from "./components/auth/Protected";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* protected route */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>}/>
    </Routes>
  );
}

export default App;
