import { useState } from "react";

import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useTodos } from "./useTodos";
import type { Priority } from "./types";

// Filtre yalnızca bu üç değerden biri olabilir
type Filter = "all" | "active" | "done";
type SortBy = "default" | "priority" | "dueDate";

function TodoPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<SortBy>("default");

  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodos();

  // Filtreleme zinciri: durum → öncelik → arama
  const visibleTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.done;
      if (filter === "done") return todo.done;
      return true; // "all"
    })
    .filter((todo) => priorityFilter === "ALL" || todo.priority === priorityFilter)
    .filter((todo) => todo.text.toLowerCase().includes(search.toLowerCase()));

  // Sıralama — diziyi kopyalayıp sıralıyoruz (sort yerinde değiştirir)
  const sortedTodos = [...visibleTodos].sort((a, b) => {
    if (sortBy === "priority") {
      const order = { HIGH: 0, NORMAL: 1, LOW: 2 };
      return order[a.priority] - order[b.priority];
    }
    if (sortBy === "dueDate") {
      if (!a.dueDate) return 1; // tarihsizler sona
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0; // "default" — backend'den gelen sıra korunur
  });

  // Kalan (tamamlanmamış) görev sayısı
  const remaining = todos.filter((todo) => !todo.done).length;

  const filterBtn="flex-1 py-1.5 text-sm rounded-lg border cursor-pointer";
  const activeBtn="border-purple-500 text-purple-600 bg-purple-50 font-semibold";
  const idleBtn="border-gray-300 text-gray-600 hover:bg-gray-100";

  return (
    <div className="min-h-screen  flex  justify-center items-start p-8  bg-gray-50">
      <div className="w-full max-w-2xl bg-white  border border-gray-200 rounded-2xl shadow-lg p-7">
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

      {/* Arama */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Görevlerde ara..."
        className="w-full px-3 py-2 mb-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500"
      />

      {/* Öncelik filtresi + sıralama */}
      <div className="flex gap-2 mb-4">
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as Priority | "ALL")}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500"
        >
          <option value="ALL">Tüm öncelikler</option>
          <option value="HIGH">Yüksek</option>
          <option value="NORMAL">Normal</option>
          <option value="LOW">Düşük</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500"
        >
          <option value="default">Varsayılan sıra</option>
          <option value="priority">Önceliğe göre</option>
          <option value="dueDate">Son tarihe göre</option>
        </select>
      </div>

      {loading && <p className="text-center text-sm text-gray-400 py-2">Yükleniyor...</p>}
      {error && <p className="text-center text-sm py-2 text-red-500">{error}</p>}

      {sortedTodos.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">
          {search || priorityFilter !== "ALL"
            ? "Aramanla eşleşen görev yok."
            : "Görev yok."}
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5 list-none">
          {sortedTodos.map((todo) => (
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

      <p className="text-center text-xs text-gray-400 mt-4">
        {remaining} görev kaldı
        {sortedTodos.length !== todos.length && ` · ${sortedTodos.length} sonuç gösteriliyor`}
      </p>
      <button className="w-full mt-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:text-red-500 hover:border-red-400 cursor-pointer" onClick={clearCompleted}>
        Tamamlananlari Temizle
      </button>
          
      </div>
    </div>
  );
}

export default TodoPage;
