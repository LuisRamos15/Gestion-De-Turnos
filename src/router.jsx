import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Schedule from "./pages/Schedule";
import QueueRoom from "./pages/WaitingRoom";
import AdminDashboard from "./pages/AdminDashboard";
import Operativo from "./pages/Operativo";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "", element: <Navigate to="/login" replace /> },
    ],
  },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { path: "agendar", element: <Schedule /> },
           { path: "sala", element: <QueueRoom /> },
          { path: "operativo", element: <Operativo /> },
            {
              path: "admin",
              element: <RoleRoute role="admin"><AdminDashboard /></RoleRoute>,
            },
          { path: "", element: <Navigate to="/agendar" replace /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;