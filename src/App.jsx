import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./state/AppContext.jsx";
import { ProtectedRoute, GuestOnly } from "./router/guards";
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
          {/* Invitados */}
          <Route element={<GuestOnly />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          {/* Ciudadano + Admin */}
          <Route element={<ProtectedRoute roles={["citizen", "admin"]} />}>
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/room" element={<WaitingRoom />} />
          </Route>
          {/* Solo Admin */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          {/* Fallback */}
          <Route path="*" element={<Login />} />
        </Routes>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}