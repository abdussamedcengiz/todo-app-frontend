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

  const {
    todos,
    loading,
    error,
    actionError,
    dismissActionError,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    // Onceden bu deger destructure EDILMIYORDU: useTodos onu
    // donduruyor, api katmani destekliyor, backend endpoint'i var --
    // ama arayuzde hicbir yere baglanmamisti.
    editTodoPriority,
    clearCompleted,
  } = useTodos();

  // Filtreleme zinciri: durum → öncelik → arama
  const visibleTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.done;
      if (filter === "done") return todo.done;
      return true; // "all"
    })
    .filter((todo) => priorityFilter === "ALL" || todo.priority === priorityFilter)
    // toLocaleLowerCase("tr"): "I" -> "ı", "İ" -> "i".
    // Varsayilan toLowerCase() Turkce'de yanlis sonuc verir --
    // "İstanbul" araması "istanbul" ile eşleşmiyordu.
    .filter((todo) =>
      todo.text
        .toLocaleLowerCase("tr")
        .includes(search.toLocaleLowerCase("tr")),
    );

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
  const tamamlananSayisi = todos.length - remaining;

  const filterBtn="flex-1 py-1.5 text-sm rounded-lg border cursor-pointer";
  const activeBtn="border-purple-500 text-purple-600 bg-purple-50 font-semibold";
  const idleBtn="border-gray-300 text-gray-600 hover:bg-gray-100";

  return (
    <div className="min-h-screen  flex  justify-center items-start p-8  bg-gray-50">
      <div className="w-full max-w-2xl bg-white  border border-gray-200 rounded-2xl shadow-lg p-7">
      <h1 className="text-2xl text-center mb-5 font-semibold text-gray-800">
        Yapılacaklar
      </h1>

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
      <label htmlFor="gorev-ara" className="sr-only">
        Görevlerde ara
      </label>
      <input
        id="gorev-ara"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Görevlerde ara..."
        className="w-full px-3 py-2 mb-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500"
      />

      {/* Öncelik filtresi + sıralama */}
      <div className="flex gap-2 mb-4">
        <label htmlFor="oncelik-filtresi" className="sr-only">
          Önceliğe göre filtrele
        </label>
        <select
          id="oncelik-filtresi"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as Priority | "ALL")}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500"
        >
          <option value="ALL">Tüm öncelikler</option>
          <option value="HIGH">Yüksek</option>
          <option value="NORMAL">Normal</option>
          <option value="LOW">Düşük</option>
        </select>

        <label htmlFor="siralama" className="sr-only">
          Sıralama
        </label>
        <select
          id="siralama"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500"
        >
          <option value="default">Varsayılan sıra</option>
          <option value="priority">Önceliğe göre</option>
          <option value="dueDate">Son tarihe göre</option>
        </select>
      </div>

      {loading && (
        <p role="status" className="text-center text-sm text-gray-400 py-2">
          Yükleniyor...
        </p>
      )}

      {/* Listenin kendisi gelemedi: sayfa calismiyor. */}
      {error && (
        <p role="alert" className="text-center text-sm py-2 text-red-500">
          {error}
        </p>
      )}

      {/* Liste duruyor ama son islem basarisiz oldu.
          Onceden bu durum HIC gosterilmiyordu: api katmani hatayi
          yutuyor, gorev sessizce eklenmemis oluyordu. */}
      {actionError && (
        <div
          role="alert"
          className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3"
        >
          <span className="flex-1">{actionError}</span>
          <button
            type="button"
            onClick={dismissActionError}
            className="text-red-400 hover:text-red-600 cursor-pointer shrink-0"
            aria-label="Hata mesajını kapat"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      )}

      {loading ? null : sortedTodos.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">
          {/* Uc ayri bos durum: filtre yuzunden mi bos, arama yuzunden
              mi, yoksa gercekten hic gorev yok mu? Onceden "filter"
              hesaba katilmiyordu ve "Tamamlanan" sekmesi bosken
              "Görev yok." yaziyordu -- oysa gorev vardi. */}
          {search || priorityFilter !== "ALL" || filter !== "all"
            ? "Bu filtreyle eşleşen görev yok."
            : "Henüz görev yok. Yukarıdan ilk görevini ekle."}
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
              onEditPriority={editTodoPriority}
            />
          ))}
        </ul>
      )}

      <p className="text-center text-xs text-gray-400 mt-4">
        {remaining} görev kaldı
        {sortedTodos.length !== todos.length && ` · ${sortedTodos.length} sonuç gösteriliyor`}
      </p>
      {/* Silinecek bir sey yokken buton aktif olmamali: basildiginda
          hicbir sey olmuyor ve kullanici "calismadi mi?" diye
          dusunuyordu. */}
      <button
        type="button"
        disabled={tamamlananSayisi === 0}
        className="w-full mt-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:text-red-500 hover:border-red-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:border-gray-300"
        onClick={clearCompleted}
      >
        Tamamlananları Temizle
        {tamamlananSayisi > 0 && ` (${tamamlananSayisi})`}
      </button>
          
      </div>
    </div>
  );
}

export default TodoPage;
