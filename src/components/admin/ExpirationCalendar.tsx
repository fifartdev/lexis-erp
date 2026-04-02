'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import elLocale from '@fullcalendar/core/locales/el'

interface CalendarEvent {
  id: string
  title: string
  date: string
  color: string
  textColor: string
}

interface ExpirationCalendarProps {
  events: CalendarEvent[]
}

export function ExpirationCalendar({ events }: ExpirationCalendarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-5">Ημερολόγιο Λήξεων</h3>
      <style>{`
        .fc .fc-toolbar-title { font-size: 1rem; font-weight: 600; color: #111827; }
        .fc .fc-button { background: #0b1433; border-color: #0b1433; font-size: 0.75rem; padding: 0.3rem 0.65rem; }
        .fc .fc-button:hover { background: #1a2a5e; border-color: #1a2a5e; }
        .fc .fc-button:focus { box-shadow: none; }
        .fc .fc-button-primary:not(:disabled).fc-button-active { background: #1a2a5e; border-color: #1a2a5e; }
        .fc .fc-col-header-cell-cushion { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-decoration: none; }
        .fc .fc-daygrid-day-number { font-size: 0.8rem; color: #374151; text-decoration: none; }
        .fc .fc-daygrid-day.fc-day-today { background: #eff6ff; }
        .fc .fc-event { border-radius: 4px; font-size: 0.72rem; padding: 1px 4px; cursor: default; border: none; }
        .fc .fc-event-title { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .fc th { border-color: #f3f4f6; }
        .fc td { border-color: #f3f4f6; }
        .fc .fc-scrollgrid { border-color: #f3f4f6; }
        .fc .fc-more-link { font-size: 0.72rem; color: #2563eb; }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale={elLocale}
        events={events}
        eventDisplay="block"
        dayMaxEvents={3}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        height="auto"
        fixedWeekCount={false}
      />
    </div>
  )
}
