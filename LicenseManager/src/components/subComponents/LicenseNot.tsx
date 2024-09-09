import React from 'react'

function LicenseNot() {
  return (
    <div className="upcoming">

      <div className="header">
          <h4>Notification</h4>
          {/* <a href="#">July <i className='bx bx-chevron-down'></i></a> */}
      </div>
      <div className="events">
          <div className="item">
              <div>
                  <i className='bx bx-time'></i>
                  <div className="event-info">
                      <a href="#">SLA license expires in a month</a>
                      <p>Date</p>
                  </div>
              </div>
              <i className='bx bx-dots-horizontal-rounded'></i>
          </div>
          <div className="item">
              <div>
                  <i className='bx bx-time'></i>
                  <div className="event-info">
                      <a href="#">New license added</a>
                      <p>Date</p>
                  </div>
              </div>
              <i className='bx bx-dots-horizontal-rounded'></i>
          </div>
          
      </div>

    </div>
  )
}

export default LicenseNot