import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import "./index.css"
// Sample events
const events = [
  { title: 'License A expires', start: new Date('2024-09-07') },
  { title: 'License B expires', start: new Date('2024-09-15') },
  { title: 'License C expires', start: new Date('2024-09-20') }
];

export function Calendar() {
  return (
    <div style={{ width: '60%', margin: '0 auto' }}>
      <h1>License Management Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto" // Adjusts the height dynamically
        eventContent={renderEventContent}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }} // Customize toolbar options
      />
    </div>
  );
}

// Custom event rendering function
function renderEventContent(eventInfo: { timeText: string; event: { title: string } }) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
