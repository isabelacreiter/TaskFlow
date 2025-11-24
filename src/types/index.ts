// src/types/index.ts
export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string; // Firestore salva como string ISO
  priority: Priority;
  status: TaskStatus;
  subtasks: Subtask[];
  createdAt: string;
}