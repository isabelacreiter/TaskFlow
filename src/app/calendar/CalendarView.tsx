// src/app/calendar/CalendarView.tsx
'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRouter } from 'next/navigation';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  color?: string; // opcional para definir cor
}

interface CalendarViewProps {
  events: CalendarEvent[];
}

export default function CalendarView({ events }: CalendarViewProps) {
  const router = useRouter();

  type CalendarEventClick = { event: { id: string } };

  const handleEventClick = (info: CalendarEventClick) => {
    router.push(`/tasks/${info.event.id}`);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events.map(e => ({
          id: e.id,
          title: e.title,
          date: e.date,
          backgroundColor: e.color ?? '#2563eb', // ✅ cor padrão (azul Tailwind)
          textColor: '#fff',                     // ✅ texto branco para contraste
        }))}
        locale="pt-br"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
        }}
        height="auto"
        eventClick={handleEventClick}
      />
    </div>
  );
}
