import { createContext } from "react";

// Context TANIMI burada, PROVIDER AuthProvider.tsx'te, HOOK useAuth.ts'te.
//
// Ucunu tek dosyada tutmak istiyorduk ama react-refresh kurali buna
// izin vermiyor: bir dosya hem bilesen hem bilesen-olmayan seyler
// disari verirse Vite'in hizli yenilemesi (fast refresh) o dosyada
// calismaz -- kod degistiginde tum uygulama state'i sifirlanir.
// Ayirma maliyeti uc kucuk dosya; karsiligi calisan bir gelistirme
// deneyimi.
export type AuthContextValue = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
