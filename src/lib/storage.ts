// GUVENLI localStorage ERISIMI
//
// localStorage her zaman kullanilabilir DEGILDIR:
//   - Safari'nin gizli sekmesinde kota 0'dir, setItem hata firlatir.
//   - Tarayici ayarlarindan site verileri engellenmis olabilir.
//
// Bu durumlarda localStorage'a DOKUNMAK bile hata firlatir ve hata
// ilk render'da olustugu icin sonuc bos beyaz bir ekran olurdu --
// uygulama sirf "token'i hatirlayamadigi" icin hic acilmazdi.
//
// Buradaki sarmalayici basit bir soz verir: DEPOLAMA CALISMIYORSA
// uygulama calismaya DEVAM EDER, sadece hatirlamaz.
export const safeStorage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Kaydedemedik. Tek sonuc: sekme kapaninca oturum unutulur.
      // Uygulamayi durdurmaya deger bir sey degil.
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Yukaridakiyle ayni gerekce.
    }
  },
};
