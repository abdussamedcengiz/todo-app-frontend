import { useState, useEffect } from "react";
import type { Priority, Todo } from "./types";
import * as api from "./api";

export function useTodos() {
const [todos, setTodos] = useState<Todo[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  

  const fetchTodos = async () => {
    try{
     
    const data= await api.getTodos();
    setTodos(data);
    setError("");
  

    }catch{
      setError("hata");

    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

const addTodo = async (text: string, priority?: Priority, dueDate?: string | null) => {
  await api.addTodo(text, priority, dueDate);
  fetchTodos();
};

  const toggleTodo = async (id: number) => {
    await api.toggleTodo(id);
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await api.deleteTodo(id);
    fetchTodos();
  };

  const clearCompleted = async()=>{
    await api.clearCompleted();
    fetchTodos();
  }

  const editTodo= async (id:number,text:string)=>{
    await api.editTodo(id,text);
    fetchTodos();
  }

  const editTodoPriority= async (id:number,priority:Priority)=>{
    await api.editTodoPriority(id,priority);
    fetchTodos();
  }
 
  return { todos, loading, error, addTodo, toggleTodo, deleteTodo, editTodo, editTodoPriority, clearCompleted };
}
