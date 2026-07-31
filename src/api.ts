
import type { Todo } from "./types";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/todos`;
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";


export const getToken=()=>localStorage.getItem("token");
export const setToken =(t:string)=>localStorage.setItem("token",t);
export const clearToken = ()=>localStorage.removeItem("token");

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getTodos():Promise<Todo[]>{
    const res =await fetch(API,{headers:headers()});
    if(!res.ok) throw new Error("Yetkisiz")
    return res.json();

}


export async function  addTodo(text: string):Promise<void>{
     await fetch(API, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ text }),
    });

}

export async function toggleTodo(id: number):Promise<void>{
    await fetch(`${API}/${id}`, { method: "PUT",
        headers: headers(),
     });

}

export async function editTodo(id: number, text: string):Promise<void>{
   await fetch(`${API}/${id}/text`, {
      method: "PUT",
     headers: headers(),
      body: JSON.stringify({ text }),
      
    });

}

export async function deleteTodo(id: number):Promise<void>{
   await fetch(`${API}/${id}`, { method: "DELETE" ,headers: headers(),});
}

export async function clearCompleted():Promise<void>{
   await fetch(`${API}/completed/all`, { method: "DELETE" ,headers: headers(),});

}


export async function login(email:string,password:string):Promise<string>{
    const res =await fetch(`${BASE}/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password}),

    });

    if(!res.ok) throw new Error("Griş başarisiz");
    const data =await res.json();
    return data.token;
}


export async function register(email:string,password:string):Promise<string>{
    const res =await fetch(`${BASE}/register`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password}),
    });

    if(!res.ok) throw new Error("Kayit başarisiz");
    const data = await res.json();
    return data.token;
}
