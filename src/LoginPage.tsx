import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "./api";

function LoginPage(){

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate=useNavigate();


  const handleSubmit =async(e:React.FormEvent)=>{
    e.preventDefault();
    setError("");
    setLoading(true);


  try{
    const token =isRegister
    ? await api.register(email,password)
    : await api.login(email,password);

    api.setToken(token)



    navigate("/")

  }catch{
    setError(isRegister? "kayit başarisiz":"Eposta veya şifre hatali");

  }finally{
    setLoading(false);
  }
    }



    return(
        <div className="min-h-screen flex justify-center items-center p-8 bg-gray-50">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-lg p-7 ">
                <h1 className="text-2xl  text-center mb-1 font-semibold text-gray-800">
                
                  {isRegister?"Kayit Ol":"Griş Yap"}</h1>
                    <p className="text-center text-gray-500 mb-5">
                      {isRegister?"Yeni bir hesap oluştur":"Hesabina griş yap"}
                    </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="E-Posta"
                    className="px-3 py-2 border border-gray-300 rounded-lg outline-none  focus:border-purple-500"
                    
                    />
                     <input
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Password"
                    className="px-3 py-2 border border-gray-300 rounded-lg outline-none  focus:border-purple-500"

                    
                    />
                    <button
                    type="submit"
                    disabled={loading}
                    className="py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >{loading ? "İşleniyor..." : isRegister ? "Kayit Ol" : "Griş Yap"}</button>
                </form>
                {error&&<p className="text-center text-sm text-red-500 mt-3">{error}</p>}
                <button onClick={()=>setIsRegister(!isRegister)} className="w-full mt-4 text-sm text-purple-600 hover:underline cursor-pointer">
                    {isRegister?"Zaten hesabim var":"Hesabim Yok kayit Olayim"}

                </button>
            </div>
        
        </div>

    )

}


export default LoginPage
