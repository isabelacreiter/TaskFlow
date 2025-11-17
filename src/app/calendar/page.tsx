// src/app/calendar/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import CalendarView from './CalendarView';
import { useAuthState } from 'react-firebase-hooks/auth'; // opcional, mas útil

export default function CalendarPage() {
  const [events, setEvents] = useState<{ id: string; title: string; date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth); // ou use seu próprio hook de autenticação

  useEffect(() => {
    if (!user) return;

    // Query apenas tarefas do usuário logado que têm dueDate
    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventList = snapshot.docs
        .map(doc => {
          const data = doc.data();
          // Converte dueDate (ISO string) para YYYY-MM-DD
          const date = data.dueDate ? data.dueDate.split('T')[0] : null;
          return date
            ? { id: doc.id, title: data.title, date }
            : null;
        })
        .filter(Boolean) as { id: string; title: string; date: string }[];

      setEvents(eventList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center">Carregando calendário...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Calendário de Tarefas</h1>
      <CalendarView events={events} />
    </div>
  );
}