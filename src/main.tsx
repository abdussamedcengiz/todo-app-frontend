import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";

// SIRALAMA: daha temel olan daha DISTA.
// AuthProvider, Router'in ICINDE olmali degil -- ama App'in
// disinda olmali ki hem nav hem rotalar oturumu gorebilsin.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
