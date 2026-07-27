import { useState, } from "react";

import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useTodos } from "./useTodos";




// Filtre yalnızca bu üç değerden biri olabilir
type Filter = "all" | "active" | "done";

function TodoPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodos();
  

  // Filtreye göre gösterilecek görevleri HESAPLIYORUZ (ayrı bir state değil)
  const visibleTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.done;
    if (filter === "done") return todo.done;
    return true; // "all"
  });

  // Kalan (tamamlanmamış) görev sayısı
  const remaining = todos.filter((todo) => !todo.done).length;

  const filterBtn="flex-1 py-1.5 text-sm rounded-lg border cursor-pointer";
  const activeBtn="border-purple-500 text-purple-600 bg-purple-50 font-semibold";
  const idleBtn="border-gray-300 text-gray-600 hover:bg-gray-100";

  return (
    <div className="min-h-screen  flex  justify-center items-start p-8  bg-gray-50">
      <div className="w-full max-w-md bg-white  border border-gray-200 rounded-2xl shadow-lg p-7">
      <h1 className="text-2xl text-center mb-5 font-semibold text-gray-800">Yapilacaklar</h1>

      <TodoForm onAdd={addTodo} />

      <div className="flex gap-2 mb-4">

        <button
          className={`${filterBtn }  ${filter ==="all"? activeBtn:idleBtn}`}
          onClick={() => setFilter("all")}
        >
          Tümü
        </button>
        <button
            className={` ${filterBtn }  ${filter ==="active"? activeBtn:idleBtn}`}
          onClick={() => setFilter("active")}
        >
          Aktif
        </button>
        <button
            className={`${filterBtn }  ${filter ==="done"? activeBtn: idleBtn}`}
          onClick={() => setFilter("done")}
        >
          Tamamlanan
        </button>
        </div>

   
      {loading && <p className="text-center text-sm text-gray-400 py-2">Yükleniyor...</p>}
      {error && <p className="text-center text-sm py-2 text-red-500">{error}</p>}

      {visibleTodos.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">Görev yok.</p>
      ) : (
        <ul className="flex flex-col gap-1.5 list-none">
          {visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))}
        </ul>
      )}

      <p className="text-center text-xs text-gray-400 mt-4">{remaining} görev kaldi</p>
      <button className="w-full mt-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:text-red-500 hover:border-red-400 cursor-pointer" onClick={clearCompleted}>
        Tamamlananları Temizle
      </button>
          
      </div>
    </div>
  );
}

export default TodoPage;