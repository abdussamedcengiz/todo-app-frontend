function About() {
  return (
    <div className="min-h-screen flex justify-center items-start p-8 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-7">
        {/* "font-semibol" yaziliyordu -- Tailwind'de boyle bir sinif
            yok, dolayisiyla baslik hic kalinlasmiyordu. */}
        <h1 className="text-2xl text-center mb-5 text-gray-800 font-semibold">
          Hakkında
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Bu uygulama React, TypeScript ve Node.js öğrenmek için yapıldı.
          Görevler kullanıcıya özeldir: her hesap yalnızca kendi görevlerini
          görür. Arayüz React + TypeScript + Tailwind, sunucu tarafı
          Express + Prisma + PostgreSQL ile yazıldı.
        </p>
      </div>
    </div>
  );
}

export default About;
