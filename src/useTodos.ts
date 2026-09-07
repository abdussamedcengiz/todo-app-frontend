import { useState, useEffect, useCallback } from "react";
import type { Priority, Todo } from "./types";
import * as api from "./api";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Listeyi getirirken olusan hata: sayfanin tamami calismiyor.
  const [error, setError] = useState<string>("");

  // Bir islem (ekle/sil/duzenle) sirasinda olusan hata: liste
  // duruyor ama son islem basarisiz oldu. Ikisini AYIRIYORUZ cunku
  // kullaniciya farkli seyler soyluyorlar.
  const [actionError, setActionError] = useState<string>("");

  // Bir islemden SONRA listeyi tazelemek icin.
  // Ilk yukleme bunu kullanmiyor (asagidaki effect'e bak):
  // orada setState'lerin callback icinde kalmasi gerekiyor.
  const fetchTodos = useCallback(async () => {
    try {
      const data = await api.getTodos();
      setTodos(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görevler yüklenemedi.");
    }
  }, []);

  // ILK YUKLEME
  //
  // setState cagrilari .then/.catch CALLBACK'lerinin icinde: effect
  // govdesinde senkron olarak state degistirmiyoruz. Kural
  // (react-hooks/set-state-in-effect) tam da bunu istiyor -- ve
  // "npm run lint" onceki surumde bu yuzden HATA ile bitiyordu.
  //
  // "iptal" bayragi ayrica gercek bir sorunu cozuyor: React
  // StrictMode gelistirmede effect'leri iki kez calistirir ve
  // bilesen istek tamamlanmadan kaldirilabilir. Bayrak olmadan
  // sonucu artik ekranda olmayan bir bilesene yazmaya calisirdik.
  useEffect(() => {
    let iptal = false;

    api
      .getTodos()
      .then((data) => {
        if (iptal) return;
        setTodos(data);
        setError("");
      })
      .catch((err: unknown) => {
        if (iptal) return;
        // Onceden buraya sadece "hata" yaziliyordu -- kullaniciya
        // hicbir sey anlatmayan bir metin.
        setError(err instanceof Error ? err.message : "Görevler yüklenemedi.");
      })
      .finally(() => {
        if (iptal) return;
        setLoading(false);
      });

    return () => {
      iptal = true;
    };
  }, []);

  // TUM ISLEMLER AYNI SARMALAYICIDAN GECER.
  //
  // Onceden her islem söyleydi:
  //   const addTodo = async (...) => { await api.addTodo(...); fetchTodos(); }
  //
  // api katmani hatayi yutuyordu, dolayisiyla basarisiz bir istek
  // sessizce "basarili" sayiliyordu. Artik api hata firlatiyor;
  // burada yakalayip kullaniciya gosteriyoruz.
  //
  // Hata durumunda fetchTodos'u YINE de cagiriyoruz: sunucudaki
  // gercek durum ne ise arayuz onu gostersin, yarim kalmis bir
  // iyimser guncelleme ekranda kalmasin.
  const run = useCallback(
    async (islem: () => Promise<unknown>) => {
      setActionError("");

      try {
        await islem();
      } catch (err) {
        setActionError(
          err instanceof Error ? err.message : "İşlem tamamlanamadı.",
        );
      } finally {
        await fetchTodos();
      }
    },
    [fetchTodos],
  );

  const addTodo = useCallback(
    (text: string, priority?: Priority, dueDate?: string | null) =>
      run(() => api.addTodo(text, priority, dueDate)),
    [run],
  );

  const toggleTodo = useCallback(
    (id: number) => run(() => api.toggleTodo(id)),
    [run],
  );

  const deleteTodo = useCallback(
    (id: number) => run(() => api.deleteTodo(id)),
    [run],
  );

  const clearCompleted = useCallback(
    () => run(() => api.clearCompleted()),
    [run],
  );

  const editTodo = useCallback(
    (id: number, text: string) => run(() => api.editTodo(id, text)),
    [run],
  );

  const editTodoPriority = useCallback(
    (id: number, priority: Priority) =>
      run(() => api.editTodoPriority(id, priority)),
    [run],
  );

  return {
    todos,
    loading,
    error,
    actionError,
    dismissActionError: () => setActionError(""),
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    editTodoPriority,
    clearCompleted,
  };
}
