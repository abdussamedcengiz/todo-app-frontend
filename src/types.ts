export type Priority = "LOW" | "NORMAL" | "HIGH";

export interface Todo {
  id: number;
  text: string;
  done: boolean;
  priority: Priority;
  dueDate: string | null;
}
