// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Title, Text, Metric, Grid, AreaChart, BadgeDelta } from '@tremor/react';
import { useTasks } from '@/hooks/useTasks';
import { subDays, isSameWeek, isBefore } from 'date-fns';

export default function DashboardPage() {
  const { tasks, loading } = useTasks();
  const [stats, setStats] = useState({
    pending: 0,
    completedThisWeek: 0,
    overdue: 0,
  });

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

  // Dados fictícios para gráfico (substitua por dados reais se quiser)
  const chartData = [
    { date: 'Seg', tasks: 3 },
    { date: 'Ter', tasks: 5 },
    { date: 'Qua', tasks: 2 },
    { date: 'Qui', tasks: 4 },
    { date: 'Sex', tasks: 6 },
    { date: 'Sáb', tasks: 1 },
    { date: 'Dom', tasks: 2 },
  ];

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <Title>Dashboard</Title>
        <Text>Visão geral das suas tarefas</Text>
      </div>

      <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
        <Card>
          <Text>Pendentes</Text>
          <Metric>{stats.pending}</Metric>
          <BadgeDelta deltaType="unresolved">Não concluídas</BadgeDelta>
        </Card>
        <Card>
          <Text>Concluídas (semana)</Text>
          <Metric>{stats.completedThisWeek}</Metric>
          <BadgeDelta deltaType="increase">Essa semana</BadgeDelta>
        </Card>
        <Card>
          <Text>Vencidas</Text>
          <Metric>{stats.overdue}</Metric>
          <BadgeDelta deltaType="decrease">Urgente!</BadgeDelta>
        </Card>
      </Grid>

      <Card className="mt-6">
        <Text>Tarefas por dia (últimos 7 dias)</Text>
        <AreaChart
          className="mt-4 h-72"
          data={chartData}
          index="date"
          categories={['tasks']}
          colors={['indigo']}
        />
      </Card>
    </div>
  );
}