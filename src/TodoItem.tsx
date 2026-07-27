import { useState } from "react";
import type { Todo } from "./types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
}

function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  // Bu satır düzenleme modunda mı? (bu satıra özel, App bilmez)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // Düzenleme kutusundaki anlık metin
  const [editText, setEditText] = useState<string>(todo.text);

  // Kaydetme işi: App'e yeni metni gönder, sonra normal moda dön
  const handleSave = () => {
    if (editText.trim() === "") return; // boşsa kaydetme
    onEdit(todo.id, editText);
    setIsEditing(false);
  };

  return (
    <li className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg">
      {isEditing ? (
        // --- DÜZENLEME MODU ---
        <>
          <input
            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg outline-none focus:border-purple-500 "
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          <button className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 cursor-pointer" onClick={handleSave}>
            Kaydet
          </button>
          <button className="px-3 py-1 border border-gray-300 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setIsEditing(false)}>
            İptal
          </button>
        </>
      ) : (
        // --- NORMAL MOD ---
        <>
          <input
          className="w-4 h-4 accent-purple-600 cursor-pointer"
            type="checkbox"
            checked={todo.done}
            onChange={() => onToggle(todo.id)}
          />
          <span className={ todo.done ? "flex-1 text-left line-through text-gray-400" : "flex-1 text-left"}>{todo.text}</span>
          <button className="bg-transparent border-none text-gray-400 cursor-pointer hover:text-purple-600 text-lg px-2" onClick={() => setIsEditing(true)}>
            ✎
          </button>
          <button className="bg-transparent border-none text-gray-400 cursor-pointer hover:text-red-500 text-lg px-2" onClick={() => onDelete(todo.id)}>
            ×
          </button>
        </>
      )}
    </li>
  );
}

export default TodoItem;