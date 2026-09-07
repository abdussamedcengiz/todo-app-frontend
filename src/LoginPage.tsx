import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";

// Sunucudaki kayit kurali (schemas.ts): en az 8 karakter.
// Ayni sayiyi burada da tutuyoruz ki kullanici formu gondermeden
// once uyarilsin -- sunucuya gidip 400 ile donmesini beklemeyelim.
const MIN_PASSWORD = 8;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }

      navigate("/", { replace: true });
    } catch (err) {
      // SUNUCUNUN MESAJINI GOSTERIYORUZ.
      //
      // Onceden hata sabitti: "kayit başarisiz". Sunucu "Şifre en az
      // 8 karakter olmalı" ya da "Bu e-posta zaten kayıtlı" dese bile
      // kullanici bunu goremiyor, neyi duzeltecegini bilemiyordu.
      setError(
        err instanceof Error
          ? err.message
          : isRegister
            ? "Kayıt başarısız."
            : "E-posta veya şifre hatalı.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Mod degisince onceki hatayi temizle: "kayıt" hatasi "giriş"
  // ekraninda asili kalmasin.
  const toggleMode = () => {
    setIsRegister((v) => !v);
    setError("");
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-8 bg-gray-50">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-lg p-7">
        <h1 className="text-2xl text-center mb-1 font-semibold text-gray-800">
          {isRegister ? "Kayıt Ol" : "Giriş Yap"}
        </h1>
        <p className="text-center text-gray-500 mb-5 text-sm">
          {isRegister ? "Yeni bir hesap oluştur" : "Hesabına giriş yap"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            {/* ETIKET EKLENDI.
                Onceden yalnizca placeholder vardi. Placeholder bir
                etiket DEGILDIR: kutuya yazmaya baslayinca kaybolur ve
                ekran okuyucular icin guvenilir bir isim saglamaz. */}
            <label
              htmlFor="email"
              className="block text-sm text-gray-600 mb-1"
            >
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@eposta.com"
              // required: tarayicinin kendi dogrulamasi. Bos formun
              // sunucuya gitmesini engeller.
              required
              // autoComplete: tarayicinin sifre yoneticisi bu
              // ipuclarina bakar. Olmadan kayitli sifreler onerilmez.
              autoComplete="email"
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-600 mb-1"
            >
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              // Kayitta alt sinir uygulanir, GIRISTE uygulanmaz:
              // eski kurallarla (6 karakter) kayit olmus bir kullanici
              // kendi hesabina girebilmeli.
              minLength={isRegister ? MIN_PASSWORD : undefined}
              autoComplete={isRegister ? "new-password" : "current-password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500"
            />
            {isRegister && (
              <p className="text-xs text-gray-500 mt-1">
                En az {MIN_PASSWORD} karakter.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "İşleniyor..." : isRegister ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </form>

        {/* role="alert": mesaj ekrana gelir gelmez ekran okuyucu
            tarafindan duyurulur, kullanici odakta olmasa bile. */}
        {error && (
          <p role="alert" className="text-center text-sm text-red-500 mt-3">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={toggleMode}
          className="w-full mt-4 text-sm text-purple-600 hover:underline cursor-pointer"
        >
          {isRegister ? "Zaten hesabım var" : "Hesabım yok, kayıt olayım"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
