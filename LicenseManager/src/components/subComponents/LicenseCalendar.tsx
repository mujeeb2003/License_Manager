import React from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

function LicenseCalendar() {
    const events = [
        { title: 'License A expires', start: new Date('2024-09-07') },
        { title: 'License A2 expires', start: new Date('2024-09-07') },
        { title: 'License B expires', start: new Date('2024-09-15') },
        { title: 'License C expires', start: new Date('2024-09-20') }
      ];
    return (
    
      <div className="prog-status">
      <div className="header">
          <h4>License Expiry</h4>
          <div className="tabs">
              {/* <a href="#" className="active">1Y</a>
              <a href="#">6M</a>
              <a href="#">3M</a> */}
          </div>
      </div>

      {/* <div className="details">
          <div className="item">
              <h2>3.45</h2>
              <p>Current GPA</p>
          </div>
          <div className="separator"></div>
          <div className="item">
              <h2>4.78</h2>
              <p>ClassName Average GPA</p>
          </div>
      </div> */}
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
    
  )
}

function renderEventContent(eventInfo: { timeText: string; event: { title: string } }) {
  return (
    <>
      {/* <b>{eventInfo.timeText}</b> */}
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export default LicenseCalendar