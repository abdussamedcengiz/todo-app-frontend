import { useState } from "react";
import type { Priority } from "./types";

// Bu bileşenin dışarıdan alacağı verilerin tipi
interface TodoFormProps {
  onAdd: (text: string, priority?: Priority, dueDate?: string | null) => void;
}

// Sunucudaki kural (schemas.ts): 1-200 karakter.
// Ayni siniri burada da uyguluyoruz ki kullanici 201. karakteri
// yazip "Ekle"ye bastiktan sonra 400 almak yerine, kutunun zaten
// daha fazlasini kabul etmedigini gorsun.
const MAX_TEXT = 200;

function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("NORMAL");
  const [dueDate, setDueDate] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const temiz = text.trim();
    if (temiz === "") return;

    const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null;

    // Kirpilmis metni gonderiyoruz: sunucu da trim uyguluyor ama
    // istemcinin gonderdigi ile kaydedilenin ayni olmasi, arayuzun
    // ne gosterecegini tahmin edilebilir kilar.
    onAdd(temiz, priority, formattedDueDate);
    setText("");
    setPriority("NORMAL");
    setDueDate(null);
  };

  return (
    <form className="flex flex-col gap-2 mb-4" onSubmit={handleSubmit}>
  {/* Üst satır: görev metni + Ekle */}
  <div className="flex gap-2">
    <label htmlFor="yeni-gorev" className="sr-only">
      Yeni görev
    </label>
    <input
      id="yeni-gorev"
      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Yeni görev yaz..."
      maxLength={MAX_TEXT}
      required
    />
    <button
      className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      type="submit"
      // Bos metinle gonderim zaten engelleniyordu ama buton aktif
      // gorunuyordu; basip hicbir sey olmamasi kafa karistirici.
      disabled={text.trim() === ""}
    >
      Ekle
    </button>
  </div>

  {/* Alt satır: öncelik + tarih */}
  <div className="flex gap-2">
    <label htmlFor="yeni-gorev-oncelik" className="sr-only">
      Öncelik
    </label>
    <select
      id="yeni-gorev-oncelik"
      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500"
      value={priority}
      onChange={(e) => setPriority(e.target.value as Priority)}
    >
      <option value="LOW">Düşük</option>
      <option value="NORMAL">Normal</option>
      <option value="HIGH">Yüksek</option>
    </select>

    <label htmlFor="yeni-gorev-tarih" className="sr-only">
      Son tarih
    </label>
    <input
      id="yeni-gorev-tarih"
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


