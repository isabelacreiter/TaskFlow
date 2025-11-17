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
}

interface CalendarViewProps {
  events: CalendarEvent[];
}

export default function CalendarView({ events }: CalendarViewProps) {
  const router = useRouter();

  const handleEventClick = (info: { event: { id: string } }) => {
    router.push(`/task/${info.event.id}`);
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
          date: e.date, // FullCalendar aceita 'date' para eventos de dia inteiro
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
        eventClick={(info) => handleEventClick(info)}
      />
    </div>
  );
}