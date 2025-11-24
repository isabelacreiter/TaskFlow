// src/app/kanban/page.tsx
'use client';

import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { KanbanBoard } from '../../components/kanban/KanbanBoard';

export default function KanbanPage() {
  const { tasks, updateTask } = useTasks();
  const [kanbanTasks, setKanbanTasks] = useState(tasks);

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'doing' | 'done') => {
    const updatedTask = tasks.find(t => t.id === taskId);
    if (updatedTask) {
      updateTask(taskId, { ...updatedTask, status: newStatus });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quadro Kanban</h1>
      <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />
    </div>
  );
}