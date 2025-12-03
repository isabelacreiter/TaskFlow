// src/app/kanban/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { Task, TaskStatus } from '@/types';
import { ArrowLeft, Trash2 } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const KanbanColumn = ({ title, status, tasks, onDelete }: {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDelete: (id: string) => void;
}) => {
  const { setNodeRef } = useSortable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-zinc-100 dark:bg-zinc-950 p-4 rounded-lg min-h-96"
    >
      <h3 className="font-bold text-lg mb-4">{title}</h3>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-8">Sem tarefas</p>
        ) : (
          tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
};

const KanbanCard = ({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg cursor-grab active:cursor-grabbing hover:shadow-md transition"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{task.title}</h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            {task.description?.substring(0, 50)}...
          </p>
          <div className="mt-2 flex gap-2 flex-wrap">
            <span
              className={`text-xs px-2 py-1 rounded ${
                task.priority === 'high'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : task.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}
            >
              {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default function KanbanPage() {
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading, updateTask, deleteTask } = useTasks();

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login';
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className="p-6 text-center">Carregando...</div>;
  }

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const doingTasks = tasks.filter((t) => t.status === 'doing');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      updateTask(taskId, { ...task, status: newStatus });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <header className="border-b bg-white dark:bg-black dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Quadro Kanban</h1>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <DndContext
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SortableContext items={['todo']} strategy={verticalListSortingStrategy}>
              <KanbanColumn
                title="A Fazer"
                status="todo"
                tasks={todoTasks}
                onDelete={deleteTask}
              />
            </SortableContext>

            <SortableContext items={['doing']} strategy={verticalListSortingStrategy}>
              <KanbanColumn
                title="Fazendo"
                status="doing"
                tasks={doingTasks}
                onDelete={deleteTask}
              />
            </SortableContext>

            <SortableContext items={['done']} strategy={verticalListSortingStrategy}>
              <KanbanColumn
                title="Concluído"
                status="done"
                tasks={doneTasks}
                onDelete={deleteTask}
              />
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </div>
  );
}