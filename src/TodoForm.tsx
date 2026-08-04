import { useState } from "react";
import type { Priority } from "./types";

// Bu bileşenin dışarıdan alacağı verilerin tipi
interface TodoFormProps {
  onAdd: (text: string, priority?: Priority , dueDate?: string | null  ) => void;
}

function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("NORMAL");
  const [dueDate, setDueDate] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "") return;
    const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null;
    
    onAdd(text, priority, formattedDueDate);      // ekleme işini yukarıya, App'e havale ediyoruz
    setText("");
    setPriority("NORMAL");
    setDueDate(null);
  };

  return (
    <form className="flex flex-col gap-2 mb-4" onSubmit={handleSubmit}>
  {/* Üst satır: görev metni + Ekle */}
  <div className="flex gap-2">
    <input
      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Yeni görev yaz..."
    />
    <button
      className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 cursor-pointer"
      type="submit"
    >
      Ekle
    </button>
  </div>

  {/* Alt satır: öncelik + tarih */}
  <div className="flex gap-2">
    <select
      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500"
      value={priority}
      onChange={(e) => setPriority(e.target.value as Priority)}
    >
      <option value="LOW">Düşük</option>
      <option value="NORMAL">Normal</option>
      <option value="HIGH">Yüksek</option>
    </select>

    <input
      type="date"
      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500"
      value={dueDate || ""}
      onChange={(e) => setDueDate(e.target.value)}
    />
  </div>
</form>
  );
}

export default TodoForm;


