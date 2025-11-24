// src/app/calendar/page.tsx
"use client";

import { useMemo } from 'react';
import CalendarView from './CalendarView';
import { useTasks } from '../../hooks/useTasks';

export default function CalendarPage() {
  const { tasks, loading } = useTasks();

  const events = useMemo(() => {
    return tasks
      .filter((t: any) => !!t.dueDate)
      .map((t: any) => ({ id: t.id, title: t.title, date: String(t.dueDate).split('T')[0] }));
  }, [tasks]);

  if (loading) return <div className="p-8 text-center">Carregando calendário...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Calendário de Tarefas</h1>
      <CalendarView events={events} />
    </div>
  );
}