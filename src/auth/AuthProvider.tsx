import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import * as api from "../api";
import { AuthContext } from "./AuthContext";
import type { AuthContextValue } from "./AuthContext";

// OTURUM DURUMU TEK YERDE.
//
// Onceden token'in varligi her yerde ayri ayri sorgulanıyordu:
//   RequireAuth -> api.getToken()
//   App         -> (hic sormuyor, "Çıkış" butonu her zaman gorunuyor)
//
// Sorun: localStorage REACT STATE DEGIL. Degistiginde React haberdar
// olmaz, bu yuzden arayuz kendini yenilemez. Cikis yapinca navigate
// ile sayfa degistigi icin tesadufen calisiyordu; token suresi
// dolduğunda ise hicbir sey olmuyordu.
//
// Context ile oturum artik gercek bir state: degistiginde onu
// kullanan her bilesen yeniden ciziliyor.
export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy initial state: bu fonksiyon yalnizca ilk render'da calisir.
  const [token, setTokenState] = useState<string | null>(() => api.getToken());

  // useCallback: logout bir useEffect'in bagimliligi olacak.
  // Her render'da yeni fonksiyon uretilseydi effect surekli yeniden
  // kurulurdu.
  const logout = useCallback(() => {
    api.clearToken();
    setTokenState(null);
  }, []);

  // OTURUM SONU DINLEYICISI
  //
  // api katmani 401 gordugunde haber veriyor. Sebep ne olursa olsun
  // (sure doldu, anahtar degisti, kullanici silindi) elimizdeki token
  // ise yaramiyor demektir.
  //
  // Gorunur sonucu: RequireAuth kullaniciyi /login'e gonderir.
  // Onceden kullanici gorev sayfasinda kalir ve her islemde sebepsiz
  // bir hata gorurdu.
  useEffect(() => api.onUnauthorized(logout), [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const newToken = await api.login(email, password);
    api.setToken(newToken);
    setTokenState(newToken);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const newToken = await api.register(email, password);
    api.setToken(newToken);
    setTokenState(newToken);
  }, []);

  const value: AuthContextValue = {
    isAuthenticated: token !== null,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

