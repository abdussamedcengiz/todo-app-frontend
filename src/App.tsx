import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import TodoPage from "./TodoPage";
import About from "./About";
import LoginPage from "./LoginPage";
import { useAuth } from "./auth/useAuth";

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  // DIKKAT: bu bir GUVENLIK onlemi DEGIL, kullanici deneyimi onlemi.
  // Gercek koruma backend'deki auth middleware'inde. Tarayicidaki her
  // sey kullanicinin kontrolunde -- localStorage'a sahte bir token
  // yazip bu kontrolu gecebilir, ama API onu reddeder.
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <nav className="flex gap-4 justify-center items-center p-4 bg-gray-50">
        <Link to="/" className="text-sm text-purple-600 hover:underline">
          Görevler
        </Link>
        <Link to="/about" className="text-sm text-purple-600 hover:underline">
          Hakkında
        </Link>

        {/* "Çıkış" ARTIK KOSULLU.
            Onceden her zaman gorunuyordu: giris sayfasindaki bir
            ziyaretci, henuz girmemisken "Çıkış" butonu goruyordu.
            Butona basmak da bir sey yapmiyordu -- silinecek token yok. */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 cursor-pointer"
          >
            Çıkış
          </button>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <TodoPage />
            </RequireAuth>
          }
        />
        <Route path="/about" element={<About />} />

        {/* Tanimsiz adresler ana sayfaya gitsin; giris yoksa
            RequireAuth oradan /login'e yonlendirir. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
