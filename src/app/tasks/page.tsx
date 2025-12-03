'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { Task } from '@/types';
import { Trash2, Edit, Plus, ArrowLeft } from 'lucide-react';
import { TaskForm } from '@/components/tasks/TaskForm';

export default function TasksPage() {
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login';
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className="p-6 text-center">Carregando...</div>;
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return task.status !== 'done';
    if (filter === 'done') return task.status === 'done';
    return true;
  });

  const handleSaveTask = async (data: Omit<Task, 'id' | 'userId' | 'createdAt'>) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
      deleteTask(id);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b bg-white dark:bg-black dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">Minhas Tarefas</h1>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            Nova Tarefa
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="mb-8 p-6 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            <TaskForm
              onSubmit={handleSaveTask}
              initialData={editingTask || undefined}
            />
            <button
              onClick={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
              className="mt-4 px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-6 flex gap-3">
          {(['all', 'pending', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-zinc-950 border dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendentes' : 'Concluídas'}
            </button>
          ))}
        </div>

        {/* Lista de Tarefas */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                {filter === 'all' && 'Nenhuma tarefa criada ainda.'}
                {filter === 'pending' && 'Nenhuma tarefa pendente.'}
                {filter === 'done' && 'Nenhuma tarefa concluída.'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.status === 'done'}
                        onChange={(e) => {
                          updateTask(task.id, {
                            ...task,
                            status: e.target.checked ? 'done' : 'todo',
                          });
                        }}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                      <div>
                        <h3
                          className={`font-semibold ${
                            task.status === 'done'
                              ? 'line-through text-zinc-500'
                              : 'text-black dark:text-white'
                          }`}
                        >
                          {task.title}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    {/* Metadados da tarefa */}
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <span className={`px-2 py-1 rounded ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {task.priority === 'high'
                          ? 'Alta'
                          : task.priority === 'medium'
                          ? 'Média'
                          : 'Baixa'}
                      </span>

                      {task.dueDate && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                          {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                      )}

                      {task.subtasks && task.subtasks.length > 0 && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded">
                          {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} sub
                        </span>
                      )}
                    </div>

                    {/* Barra de Progresso */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${
                                (task.subtasks.filter((s) => s.completed).length /
                                  task.subtasks.length) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-indigo-600"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
