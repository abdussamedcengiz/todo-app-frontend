import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// CUSTOM HOOK
// Adi "use" ile baslamak ZORUNDA -- React kurali.
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth, AuthProvider içinde kullanılmalı");
  }

  return context;
}
