import { Routes, Route, Link } from "react-router-dom";
import TodoPage from "./TodoPage";
import  About from "./About";

function App() {
  return (
    <div>
      <nav className="flex gap-4 justify-center p-4 bg-gray-50">
        <Link to="/" className="text-sm text-purple-600 hover:underline">
          Görevler
        </Link>
        <Link to="/about" className="text-sm text-purple-600 hover:underline">
          Hakkında
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<TodoPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App; 