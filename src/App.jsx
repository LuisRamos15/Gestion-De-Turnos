import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./state/AppContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Schedule from "./pages/Schedule";
import WaitingRoom from "./pages/WaitingRoom";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <Navbar />
          <Routes>
            {/* Público */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Ciudadano */}
            <Route element={<ProtectedRoute requireRole="citizen" />}>
              <Route path="/agendar" element={<Schedule />} />
              <Route path="/sala" element={<WaitingRoom />} />
            </Route>
            {/* Admin */}
            <Route element={<ProtectedRoute requireRole="admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            {/* 404 simple */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}