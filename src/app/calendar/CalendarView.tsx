// src/app/calendar/CalendarView.tsx
'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
}

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (taskId: string) => void;
}

export default function CalendarView({ events, onEventClick }: CalendarViewProps) {
  type CalendarEventClick = { event: { id: string } };

  const handleEventClick = (info: CalendarEventClick) => {
    onEventClick(info.event.id);
  };

  return (
    <div className="p-4 bg-white dark:bg-zinc-950 rounded-lg shadow-md">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events.map(e => ({
          id: e.id,
          title: e.title,
          date: e.date,
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