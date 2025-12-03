// src/app/calendar/page.tsx
"use client";

import { useMemo, useState } from 'react';
import CalendarView from './CalendarView';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '@/types';
import { X } from 'lucide-react';

export default function CalendarPage() {
  const { tasks, loading } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const events = useMemo(() => {
    return tasks
      .filter((t: any) => !!t.dueDate)
      .map((t: any) => ({ id: t.id, title: t.title, date: String(t.dueDate).split('T')[0] }));
  }, [tasks]);

  const handleEventClick = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando calendário...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Calendário de Tarefas</h1>
      <CalendarView events={events} onEventClick={handleEventClick} />

      {/* Modal de Detalhes da Tarefa */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-950 rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold">{selectedTask.title}</h2>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400">Descrição</h3>
                <p className="mt-1">{selectedTask.description || 'Sem descrição'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400">Prioridade</h3>
                  <span className={`inline-block mt-1 px-3 py-1 rounded text-sm font-medium ${
                    selectedTask.priority === 'high'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : selectedTask.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {selectedTask.priority === 'high' ? 'Alta' : selectedTask.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400">Status</h3>
                  <span className={`inline-block mt-1 px-3 py-1 rounded text-sm font-medium ${
                    selectedTask.status === 'done'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : selectedTask.status === 'doing'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {selectedTask.status === 'done' ? 'Concluído' : selectedTask.status === 'doing' ? 'Fazendo' : 'A Fazer'}
                  </span>
                </div>
              </div>

              {selectedTask.dueDate && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400">Data de Vencimento</h3>
                  <p className="mt-1">{new Date(selectedTask.dueDate).toLocaleDateString('pt-BR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}</p>
                </div>
              )}

              {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Sub-tarefas ({selectedTask.subtasks.filter((s) => s.completed).length}/{selectedTask.subtasks.length})
                  </h3>
                  <ul className="space-y-2">
                    {selectedTask.subtasks.map((subtask) => (
                      <li key={subtask.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          disabled
                          className="w-4 h-4"
                        />
                        <span className={subtask.completed ? 'line-through text-gray-500' : ''}>
                          {subtask.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}