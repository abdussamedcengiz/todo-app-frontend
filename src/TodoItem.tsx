import { useState } from "react";
import type { KeyboardEvent } from "react";
import type { Priority, Todo } from "./types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
  // Bu satir YENI.
  //
  // api.editTodoPriority ve useTodos.editTodoPriority zaten yaziliydi
  // ama arayuzde HICBIR YERE baglanmamisti: backend'de calisan bir
  // ozellik, kullanicinin erisemedigi olu kod olarak duruyordu.
  onEditPriority: (id: number, priority: Priority) => void;
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

// Sunucudaki kural (schemas.ts): 1-200 karakter.
const MAX_TEXT = 200;

function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onEditPriority,
}: TodoItemProps) {
  // Bu satır düzenleme modunda mı? (bu satıra özel, sayfa bilmez)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(todo.text);

  const handleSave = () => {
    const temiz = editText.trim();

    if (temiz === "") return; // boşsa kaydetme

    // Degismediyse sunucuya gitmeye gerek yok.
    if (temiz === todo.text) {
      setIsEditing(false);
      return;
    }

    onEdit(todo.id, temiz);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Iptal ederken kutuyu ESKI degere dondur. Onceden metin
    // duzenlenmis haliyle kaliyordu: kullanici iptal edip tekrar
    // duzenlemeye girdiginde vazgectigi metni goruyordu.
    setEditText(todo.text);
    setIsEditing(false);
  };

  // KLAVYE DESTEGI.
  // Onceden kaydetmenin tek yolu fareyle butona basmakti; bir metin
  // kutusunda Enter'in kaydetmesi ve Escape'in iptal etmesi en temel
  // beklentidir.
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <li className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg">
      {isEditing ? (
        // --- DÜZENLEME MODU ---
        <>
          <input
            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg outline-none focus:border-purple-500"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={MAX_TEXT}
            aria-label="Görev metnini düzenle"
            autoFocus
          />

          <button
            type="button"
            className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 cursor-pointer"
            onClick={handleSave}
          >
            Kaydet
          </button>

          <button
            type="button"
            className="px-3 py-1 border border-gray-300 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={handleCancel}
          >
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
            // Ekran okuyucu icin: onceden bu kutunun hicbir adi yoktu,
            // yalnizca "onay kutusu" diye okunuyordu.
            aria-label={`"${todo.text}" görevini tamamlandı olarak işaretle`}
          />

          <div className="flex-1 min-w-0">
            <span
              className={
                todo.done
                  ? "block text-left line-through text-gray-400 truncate"
                  : "block text-left truncate"
              }
              // Kisaltilan metnin tamami fare ustune gelince gorunsun.
              title={todo.text}
            >
              {todo.text}
            </span>

            <div className="flex items-center gap-2 mt-0.5">
              {/* Oncelik artik SALT OKUNUR bir rozet degil, bir secim.
                  Rozetin rengi korunuyor; select'i seffaf yapip
                  rozetin uzerine bindiriyoruz. */}
              <label className="sr-only" htmlFor={`priority-${todo.id}`}>
                Öncelik
              </label>
              <select
                id={`priority-${todo.id}`}
                value={todo.priority}
                onChange={(e) =>
                  onEditPriority(todo.id, e.target.value as Priority)
                }
                className={`text-xs px-2 py-0.5 rounded-full cursor-pointer border-none outline-none ${priorityStyles[todo.priority]}`}
              >
                {(Object.keys(priorityLabels) as Priority[]).map((p) => (
                  <option key={p} value={p}>
                    {priorityLabels[p]}
                  </option>
                ))}
              </select>

              {todo.dueDate && (
                <span className="text-xs text-gray-500">
                  {new Date(todo.dueDate).toLocaleDateString("tr-TR")}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="bg-transparent border-none text-gray-400 cursor-pointer hover:text-purple-600 text-lg px-2 shrink-0"
            onClick={() => setIsEditing(true)}
            // "✎" ve "×" karakterleri ekran okuyucuda anlamsiz
            // (ya da hic) okunur. Gercek bir ad veriyoruz.
            aria-label={`"${todo.text}" görevini düzenle`}
          >
            <span aria-hidden="true">✎</span>
          </button>

          <button
            type="button"
            className="bg-transparent border-none text-gray-400 cursor-pointer hover:text-red-500 text-lg px-2 shrink-0"
            onClick={() => onDelete(todo.id)}
            aria-label={`"${todo.text}" görevini sil`}
          >
            <span aria-hidden="true">×</span>
          </button>
        </>
      )}
    </li>
  );
}

export default TodoItem;
