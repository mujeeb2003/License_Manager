import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // for navigation
import type { RootState, License } from '../../types';

function LicenseCalendar() {
  const { licenses } = useSelector((state: RootState) => state.license);
  const navigate = useNavigate();

  // Map licenses to FullCalendar events
  const events = licenses.map((license: License) => ({
    title: `${license.title}`, // Event title
    start: new Date(license.expiry_date), // Event date
    id: license.license_id.toString() // For identifying the event
  }));

  // Handle event click and redirect with filter
  const handleEventClick = (eventInfo: any) => {
    const clickedLicense = licenses.find((license) => license.license_id === parseInt(eventInfo.event.id));

    if (clickedLicense) {
      // Navigate to the licenses page and apply filter by title
      navigate(`/home/licenses?title=${encodeURIComponent(clickedLicense.title)}`);
    }
  };

  return (
    <div className="prog-status">
      <div className="header">
        <h4>License Expiry</h4>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto" // Adjusts the height dynamically
        eventContent={renderEventContent} // Render custom event content
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }} // Customize toolbar options
        eventClick={handleEventClick} // Handle event click
        
      />
    </div>
  );
}

// Renders the title for each event
function renderEventContent(eventInfo: { timeText: string; event: { title: string} }) {
  return (
    <>
      <i style={{cursor:'pointer'}}>{eventInfo.event.title}</i>
    </>
  );
}

export default LicenseCalendar;
