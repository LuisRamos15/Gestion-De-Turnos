import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./state/AppContext.jsx";
import { TicketsProvider } from "./context/TicketsContext";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <AppProvider>
        <TicketsProvider>
          <App />
        </TicketsProvider>
      </AppProvider>
    </AuthProvider>
  </BrowserRouter>
);