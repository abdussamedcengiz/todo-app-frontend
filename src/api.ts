import type { Priority, Todo } from "./types";
import { safeStorage } from "./lib/storage";

// API adresi TEK yerde tanimli.
//
// Onceden iki sabit vardi (BASE ve API = BASE + "/todos") ve ikisi de
// ayni ifadeyi tekrar ediyordu. Tek kaynak, iki turev.
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TODOS = `${BASE}/todos`;

const TOKEN_KEY = "token";

export const getToken = () => safeStorage.get(TOKEN_KEY);
export const setToken = (t: string) => safeStorage.set(TOKEN_KEY, t);
export const clearToken = () => safeStorage.remove(TOKEN_KEY);

// SUNUCU HATALARINI TASIYAN HATA TIPI.
//
// Onceden hatalar sabit metinlerdi ("Kayit başarisiz") ve sunucunun
// ne dedigi ATILIYORDU. Kullanici "Şifre en az 8 karakter olmalı"
// yerine "kayit başarisiz" goruyor, neyi duzeltecegini bilemiyordu.
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// OTURUM SONU BILDIRIMI
//
// Token 7 gun gecerli. Suresi dolunca arayuz bunu anlamiyordu:
// elinde bir token var, kendini "giris yapmis" sayiyor, her istek
// 401 donuyor ve kullanici sebebini goremeden kilitli kaliyordu.
//
// Bu dosya bir component degil; hook cagiramaz, yonlendirme yapamaz.
// Bu yuzden yalnizca HABER VERIYOR; useAuth bu olayi dinleyip
// oturumu temizliyor.
type Listener = () => void;
const unauthorizedListeners = new Set<Listener>();

export function onUnauthorized(listener: Listener) {
  unauthorizedListeners.add(listener);
  return () => {
    unauthorizedListeners.delete(listener);
  };
}

function headers(): Record<string, string> {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    // Token yoksa basligi HIC gondermiyoruz.
    // Onceden "Bearer null" gonderiliyordu -- sunucu icin anlamsiz
    // ve loglarda gercek bir sorunmus gibi gorunen bir deger.
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// TUM ISTEKLERIN GECTIGI TEK NOKTA.
//
// Onceki surumde YALNIZCA getTodos cevabi kontrol ediyordu.
// addTodo, toggleTodo, editTodo, deleteTodo ve clearCompleted
// "await fetch(...)" deyip sonucu HIC BAKMADAN geciyordu: sunucu
// 400, 401, 429 ya da 500 donse bile arayuz basarili saymis gibi
// devam ediyor, kullanici hicbir geri bildirim almiyordu.
// Gorev sessizce kaybolur, sebebi anlasilmazdi.
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  let res: Response;

  try {
    res = await fetch(url, { ...options, headers: headers() });
  } catch {
    // fetch YALNIZCA ag seviyesinde reddeder: internet yok, sunucu
    // uykuda, DNS cozulemedi. 404/500 gibi cevaplar buraya dusmez.
    throw new ApiError(
      "Sunucuya ulaşılamadı. Bağlantını kontrol et; ücretsiz sunucu uyanıyor olabilir.",
      0,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && getToken()) {
      for (const listener of unauthorizedListeners) listener();
    }

    // Sunucunun kendi mesajini kullaniyoruz; yoksa duruma gore
    // anlamli bir yedek.
    throw new ApiError(data?.error ?? varsayilanMesaj(res.status), res.status);
  }

  return data as T;
}

function varsayilanMesaj(status: number): string {
  if (status === 401) return "Oturumun sona ermiş. Tekrar giriş yap.";
  if (status === 429) return "Çok fazla istek gönderdin. Biraz bekle.";
  if (status >= 500) return "Sunucuda bir hata oluştu. Birazdan tekrar dene.";
  return "Bir hata oluştu.";
}

// --- GOREVLER ---

export function getTodos(): Promise<Todo[]> {
  return request<Todo[]>(TODOS);
}

export function addTodo(
  text: string,
  priority?: Priority,
  dueDate?: string | null,
): Promise<Todo> {
  return request<Todo>(TODOS, {
    method: "POST",
    body: JSON.stringify({ text, priority, dueDate }),
  });
}

export function toggleTodo(id: number): Promise<Todo> {
  return request<Todo>(`${TODOS}/${id}`, { method: "PUT" });
}

export function editTodo(id: number, text: string): Promise<Todo> {
  return request<Todo>(`${TODOS}/${id}/text`, {
    method: "PUT",
    body: JSON.stringify({ text }),
  });
}

export function editTodoPriority(id: number, priority: Priority): Promise<Todo> {
  return request<Todo>(`${TODOS}/${id}/priority`, {
    method: "PUT",
    body: JSON.stringify({ priority }),
  });
}

export function deleteTodo(id: number): Promise<void> {
  return request<void>(`${TODOS}/${id}`, { method: "DELETE" });
}

export function clearCompleted(): Promise<void> {
  return request<void>(`${TODOS}/completed/all`, { method: "DELETE" });
}

// --- KIMLIK ---

type TokenResponse = { token: string };

export async function login(email: string, password: string): Promise<string> {
  const data = await request<TokenResponse>(`${BASE}/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return data.token;
}

export async function register(
  email: string,
  password: string,
): Promise<string> {
  const data = await request<TokenResponse>(`${BASE}/register`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return data.token;
}
