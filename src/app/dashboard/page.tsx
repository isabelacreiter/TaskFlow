// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Title, Text, Metric, Grid, AreaChart, BarChart, BadgeDelta } from '@tremor/react';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { subDays, isSameWeek, isBefore } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading } = useTasks();
  const [stats, setStats] = useState({
    pending: 0,
    completedThisWeek: 0,
    overdue: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login';
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (tasks.length === 0) return;

    const now = new Date();
    const pending = tasks.filter((t) => t.status !== 'done').length;
    const completedThisWeek = tasks.filter((t) =>
      t.status === 'done' && t.createdAt && isSameWeek(new Date(t.createdAt), now, { weekStartsOn: 1 })
    ).length;
    const overdue = tasks.filter((t) =>
      t.status !== 'done' && t.dueDate && isBefore(new Date(t.dueDate), now)
    ).length;

    setStats({ pending, completedThisWeek, overdue });
  }, [tasks]);

  // Dados fictícios para gráfico de área (últimos 7 dias)
  const areaChartData = [
    { date: 'Seg', tasks: 3 },
    { date: 'Ter', tasks: 5 },
    { date: 'Qua', tasks: 2 },
    { date: 'Qui', tasks: 4 },
    { date: 'Sex', tasks: 6 },
    { date: 'Sáb', tasks: 1 },
    { date: 'Dom', tasks: 2 },
  ];

  // Dados reais para gráfico de barras (tarefas por prioridade)
  const barChartData = [
    {
      name: 'Prioridade',
      'Baixa': tasks.filter((t) => t.priority === 'low').length,
      'Média': tasks.filter((t) => t.priority === 'medium').length,
      'Alta': tasks.filter((t) => t.priority === 'high').length,
    },
  ];

  if (authLoading || loading) return <div className="p-6 text-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b bg-white dark:bg-black dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Descrição */}
        <div>
          <p className="text-zinc-600 dark:text-zinc-400">Visão geral das suas tarefas</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Pendentes</p>
            <p className="text-3xl font-bold mt-2">{stats.pending}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">Não concluídas</p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Concluídas</p>
            <p className="text-3xl font-bold mt-2">{stats.completedThisWeek}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">Essa semana</p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Vencidas</p>
            <p className="text-3xl font-bold mt-2 text-red-600">{stats.overdue}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">Urgente!</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Tarefas por dia (últimos 7 dias)</h3>
            <AreaChart
              className="h-72"
              data={areaChartData}
              index="date"
              categories={['tasks']}
              colors={['indigo']}
            />
          </div>

          <div className="p-6 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Tarefas por Prioridade</h3>
            <BarChart
              className="h-72"
              data={barChartData}
              index="name"
              categories={['Baixa', 'Média', 'Alta']}
              colors={['green', 'yellow', 'red']}
            />
          </div>
        </div>
      </div>
    </div>
  );
}