import { useState } from "react";

// Bu bileşenin dışarıdan alacağı verilerin tipi
interface TodoFormProps {
  onAdd: (text: string) => void;
}

function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "") return;
    onAdd(text);      // ekleme işini yukarıya, App'e havale ediyoruz
    setText("");
  };

  return (
    <form className="flex gap-2 mb-4"  onSubmit={handleSubmit}>
      <input
      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Yeni görev yaz..."
      />
      <button className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 cursor-pointer" type="submit">Ekle</button>
    </form>
  );
}

export default TodoForm;


