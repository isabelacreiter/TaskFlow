// src/types/index.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

export type TaskStatus = 'todo' | 'inProgress' | 'done';