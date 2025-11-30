"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { isSameWeek, isBefore } from "date-fns";

export default function Home() {
  const { tasks, loading } = useTasks();
  const [stats, setStats] = useState({ pending: 0, completedThisWeek: 0, overdue: 0 });

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      setStats({ pending: 0, completedThisWeek: 0, overdue: 0 });
      return;
    }

    const now = new Date();
    const pending = tasks.filter((t) => t.status !== "done").length;
    const completedThisWeek = tasks.filter((t) =>
      t.status === "done" && t.createdAt && isSameWeek(new Date(t.createdAt), now, { weekStartsOn: 1 })
    ).length;
    const overdue = tasks.filter((t) => t.status !== "done" && t.dueDate && isBefore(new Date(t.dueDate), now)).length;

    setStats({ pending, completedThisWeek, overdue });
  }, [tasks]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-foreground">
      <main className="mx-auto max-w-4xl p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">TaskFlow</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Gerencie suas tarefas de forma simples</p>
          </div>
          <nav className="flex gap-3">
            <Link href="/dashboard" className="px-4 py-2 rounded-md bg-indigo-600 text-white">Dashboard</Link>
            <Link href="/kanban" className="px-4 py-2 rounded-md border">Kanban</Link>
            <Link href="/calendar" className="px-4 py-2 rounded-md border">Calendar</Link>
            <Link href="/tasks" className="px-4 py-2 rounded-md border">Tasks</Link>
            <Link href="/login" className="px-4 py-2 rounded-md border">Login</Link>
          </nav>
        </header>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm text-zinc-500">Pendentes</h3>
            <p className="mt-2 text-2xl font-semibold">{loading ? '—' : stats.pending}</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm text-zinc-500">Concluídas (semana)</h3>
            <p className="mt-2 text-2xl font-semibold">{loading ? '—' : stats.completedThisWeek}</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm text-zinc-500">Vencidas</h3>
            <p className="mt-2 text-2xl font-semibold text-rose-600">{loading ? '—' : stats.overdue}</p>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex gap-3">
            <Link href="/dashboard" className="rounded-md bg-indigo-600 px-4 py-2 text-white">Ir para Dashboard</Link>
            <Link href="/tasks" className="rounded-md border px-4 py-2">Ver Tarefas</Link>
            <Link href="/kanban" className="rounded-md border px-4 py-2">Abrir Kanban</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
