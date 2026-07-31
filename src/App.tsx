import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import TodoPage from "./TodoPage";
import About from "./About";
import LoginPage from "./LoginPage";
import * as api from "./api";

function RequireAuth({ children }: { children: React.ReactNode }) {
  return api.getToken() ? children : <Navigate to="/login" replace />;
}



function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
  api.clearToken();
  navigate("/login");
};
  return (
    <div>
      <nav className="flex gap-4 justify-center p-4 bg-gray-50">
        <button
         onClick={handleLogout}
           className="text-sm text-gray-500 hover:text-red-500 cursor-pointer"
        >
               Çikiş
         </button>

        <Link to="/" className="text-sm text-purple-600 hover:underline">
          Görevler
        </Link>
        <Link to="/about" className="text-sm text-purple-600 hover:underline">
          Hakkinda
        </Link>
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
  </Routes>
    </div>
  );
}

export default App; 
