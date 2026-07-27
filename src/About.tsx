function About() {
  return (
    <div className=" min-h-screen flex justify-center items-start p-8 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-7">
        <h1 className="text-2xl text-center mb-5 text-gray-800 font-semibol ">Hakkinda</h1>
        <p className="text-gray-600 text-sm">
          Bu uygulama React, TypeScript ve Node.js öğrenmek için yapıldı.
        </p>
      </div>
    </div>
  );
}

export default About;