
import type { Todo } from "./types";

const API = "http://localhost:5000/todos";


export async function getTodos():Promise<Todo[]>{
    const res =await fetch(API);
    return res.json();

}


export async function  addTodo(text: string):Promise<void>{
     await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

}

export async function toggleTodo(id: number):Promise<void>{
    await fetch(`${API}/${id}`, { method: "PUT" });

}

export async function editTodo(id: number, text: string):Promise<void>{
   await fetch(`${API}/${id}/text`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      
    });

}

export async function deleteTodo(id: number):Promise<void>{
   await fetch(`${API}/${id}`, { method: "DELETE" });
}

export async function clearCompleted():Promise<void>{
   await fetch(`${API}/completed/all`, { method: "DELETE" });

}