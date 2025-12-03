// src/components/tasks/TaskForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '@/lib/validation/taskSchema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SubtaskItem } from '@/components/tasks/SubtaskItem';
import type { Task, Subtask } from '@/types';

const generateId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

type TaskFormData = Omit<Task, 'id' | 'userId' | 'createdAt' | 'subtasks'> & {
  subtasks: { id: string; title: string }[];
};

export function TaskForm({ onSubmit, initialData }: {
  onSubmit: (data: Omit<Task, 'id' | 'userId' | 'createdAt'>) => void;
  initialData?: Task;
}) {
  type SubtaskInput = { id: string; title: string };
  const [subtasks, setSubtasks] = useState<SubtaskInput[]>(
    (initialData?.subtasks?.map((s) => ({ id: s.id, title: s.title })) as SubtaskInput[]) || [{ id: generateId(), title: '' }]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema as any),
    defaultValues: initialData
      ? {
          ...initialData,
          subtasks: (initialData.subtasks || []).map((s) => ({ id: s.id, title: s.title })),
          status: initialData.status || 'todo',
        }
      : {
          status: 'todo',
          priority: 'medium',
        },
  });

  const addSubtask = () => setSubtasks([...subtasks, { id: generateId(), title: '' }]);
  const removeSubtask = (id: string) => setSubtasks(subtasks.filter((s) => s.id !== id));
  const updateSubtask = (id: string, title: string) => {
    setSubtasks(subtasks.map((s) => (s.id === id ? { ...s, title } : s)));
  };

  const onSubmitForm = (data: TaskFormData) => {
    const formattedSubtasks = subtasks
      .filter((s) => s.title.trim())
      .map((s) => ({ id: s.id, title: s.title, completed: false }));

    onSubmit({
      ...data,
      subtasks: formattedSubtasks,
      dueDate: data.dueDate || '',
      priority: (data.priority || 'medium') as Task['priority'],
      status: (data.status || 'todo') as Task['status'],
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div>
        <Input {...register('title')} placeholder="Título da tarefa" />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message as string}</p>}
      </div>

      <div>
        <textarea
          {...register('description')}
          placeholder="Descrição"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={3}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message as string}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input {...register('dueDate')} type="date" />
          {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message as string}</p>}
        </div>
        <div>
          <select
            {...register('priority')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <select
          {...register('status')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="todo">A Fazer</option>
          <option value="doing">Fazendo</option>
          <option value="done">Concluído</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Sub-tarefas</label>
        {subtasks.map((subtask) => (
          <SubtaskItem
            key={subtask.id}
            id={subtask.id}
            title={subtask.title}
            onUpdate={updateSubtask}
            onRemove={() => removeSubtask(subtask.id)}
            disabled={subtasks.length === 1}
          />
        ))}
        <Button type="button" onClick={addSubtask} className="mt-2">
          + Adicionar sub-tarefa
        </Button>
      </div>

      <Button type="submit">Salvar tarefa</Button>
    </form>
  );
}