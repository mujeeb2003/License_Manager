import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import type { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react'

const events = [
  { title: 'Meeting', start: new Date() }
]

export function Calendar() {
  return (
    <div>
      <h1>Demo App</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        // weekends={false}
        events={events}
        // dayCount={2}

        eventContent={renderEventContent}
      />
    </div>
  )
}

// a custom render function
function renderEventContent(eventInfo: { timeText: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; event: { title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined } }) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}