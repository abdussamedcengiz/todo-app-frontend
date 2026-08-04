import { useState } from "react";
import type { Priority, Todo } from "./types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
}
const priorityStyles: Record<Priority, string> = {
  LOW: "bg-gray-100 text-gray-600",
  NORMAL: "bg-blue-100 text-blue-700",
  HIGH: "bg-red-100 text-red-700",
};

const priorityLabels: Record<Priority, string> = {
  LOW: "Düşük",
  NORMAL: "Normal",
  HIGH: "Yüksek",
};


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
          className="w-4 h-4 accent-purple-600 cursor-pointer shrink-0"
            type="checkbox"
            checked={todo.done}
            onChange={() => onToggle(todo.id)}
          />
          <div className="flex-1  min-w-0">

          <span className={ todo.done ? "block text-left line-through text-gray-400 truncate" : "block text-left truncate"}>{todo.text}</span>
           <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs px-2  py-0.5  rounded-full ${priorityStyles[todo.priority]}`}>
            {priorityLabels[todo.priority]}
          </span>
         
          {todo.dueDate && (
            <span className="text-xs text-gray-500">
              {new Date(todo.dueDate).toLocaleDateString("tr-TR")}
            </span>
          )
          }
          </div>
          </div>

          <button className="bg-transparent border-none text-gray-400 cursor-pointer hover:text-purple-600 text-lg px-2 shrink-0" onClick={() => setIsEditing(true)}>
            ✎
          </button>
          <button className="bg-transparent border-none text-gray-400 cursor-pointer hover:text-red-500 text-lg px-2 shrink-0" onClick={() => onDelete(todo.id)}>
            ×
          </button>
          
        </>
      )}
    </li>
  );
}

export default TodoItem;
