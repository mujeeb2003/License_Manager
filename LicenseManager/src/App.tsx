import React from 'react'
import "./App.css";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import "./index.css"
import {LinearProgress} from "@mui/material"

function App() {
    // Sample events
    const events = [
      { title: 'License A expires', start: new Date('2024-09-07') },
      { title: 'License B expires', start: new Date('2024-09-15') },
      { title: 'License C expires', start: new Date('2024-09-20') }
    ];
  return (
    <>
      <div className="top-container">

        <div className="nav">
            <div className="logo">
                <i className='bx bxl-codepen'></i>
                <a href="#">4Sight Technologies</a>
            </div>

            <div className="nav-links">
                <a href="#">Dashboard</a>
                <a href="#">Licenses</a>
                <a href="#">Category</a>
                <a href="#">Vendors</a>
            </div>

            <div className="right-section">
                <i className='bx bx-bell'></i>
                <i className='bx bx-search'></i>

                <div className="profile">
                    <div className="info">
                        <img src="assets/profile.png" />
                        <div>
                            <a href="#">Alex Johnson</a>
                            <p>Data Scientist</p>
                        </div>
                    </div>
                    <i className='bx bx-chevron-down'></i>
                </div>
            </div>

        </div>

        <div className="status">
            <div className="header">
                <h4 id="big">Your Licenses</h4>
                <h4 id="small">Statistics</h4>
            </div>

            <div className="items-list">
                <div className="item">
                    <div className="info">
                        <div>
                            <h5>Up to Date</h5>
                            <p>- 3 SLA</p>
                            <p>- 1 PAM</p>
                        </div>
                        <i className='bx bx-data'></i>
                    </div>
                    {/* <div className="progress">
                        <div className="bar"></div>
                    </div> */}
                </div>
                <div className="item">
                    <div className="info">
                        <div>
                            <h5>Near to Expiry</h5>
                            <p>- 2 SLA</p>
                            <p>- 5 PAM</p>
                        </div>
                        <i className='bx bx-terminal'></i>
                    </div>
                    {/* <div className="progress">
                        <div className="bar"></div>
                    </div> */}
                </div>
                <div className="item">
                    <div className="info">
                        <div>
                            <h5>Expired</h5>
                            <p>- 4 SLA</p>
                            <p>- 8 PAM</p>
                        </div>
                        <i className='bx bxl-python'></i>
                    </div>
                    {/* <div className="progress">
                        <div className="bar"></div>
                    </div> */}
                </div>
                <div className="item" style={{display:'flex',flexDirection:'column',gap:'40px'}}>
                <span style={{color:'#ccc'}}>
                    Up to Date
                    <LinearProgress variant="determinate" value={50} />
                </span>
                <span style={{color:'#ccc'}}>
                    Near to Expiry
                <LinearProgress variant="determinate" value={70} />
                </span>
                <span style={{color:'#ccc'}}>
                    Expired
                <LinearProgress variant="determinate" value={80} />
                </span>
                    {/* <canvas className="activity-chart"></canvas> */}
                </div>
            </div>

        </div>

      </div>

     
      <div className="bottom-container">
        <div className="popular">
            <div className="header">
                <h4>Licenses</h4>
                <a href="#"># Data</a>
            </div>
            <div className="yearly-table">
                <table>
                  <thead>
                    <th></th>
                    <th>Jan</th>
                    <th>Feb</th>
                    <th>Mar</th>
                    <th>Apr</th>
                    <th>May</th>
                    <th>Jun</th>
                    <th>Jul</th>
                    <th>Aug</th>
                    <th>Sep</th>
                    <th>Oct</th>
                    <th>Nov</th>
                    <th>Dec</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2024</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>2025</td>
                      <td>1</td>
                      <td>1</td>
                      <td>1</td>
                      <td>1</td>
                      <td>1</td>
                      <td>1</td>
                      <td>3</td>
                      <td>3</td>
                      <td>3</td>
                      <td>0</td>
                      <td>3</td>
                      <td>3</td>
                    </tr>
                  </tbody>

                </table>
            </div>
            
        </div>

      </div>

      <div className="bottom-container">

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
{/* 
        <div className="popular">
            <div className="header">
                <h4>Popular</h4>
                <a href="#"># Data</a>
            </div>

            <img src="assets/podcast.jpg" />
            <div className="audio">
                <i className='bx bx-podcast'></i>
                <a href="#">Poedcast: Mastering Data Visualization</a>
            </div>
            <p>Learn to create compelling visualizations with data.</p>
            <div className="listen">
                <div className="author">
                    <img src="assets/profile.png" />
                    <div>
                        <a href="#">Alex</a>
                        <p>Data Analyst</p>
                    </div>
                </div>
                <button>Listen<i className='bx bx-right-arrow-alt'></i></button>
            </div>

        </div> */}


        <div className="upcoming">

            <div className="header">
                <h4>Notification</h4>
                {/* <a href="#">July <i className='bx bx-chevron-down'></i></a> */}
            </div>

            {/* <div className="dates">
                <div className="item">
                    <h5>Mo</h5>
                    <a href="#">12</a>
                </div>
                <div className="item active">
                    <h5>Tu</h5>
                    <a href="#">13</a>
                </div>
                <div className="item">
                    <h5>We</h5>
                    <a href="#">14</a>
                </div>
                <div className="item">
                    <h5>Th</h5>
                    <a href="#">15</a>
                </div>
                <div className="item">
                    <h5>Fr</h5>
                    <a href="#">16</a>
                </div>
                <div className="item">
                    <h5>Sa</h5>
                    <a href="#">17</a>
                </div>
                <div className="item">
                    <h5>Su</h5>
                    <a href="#">18</a>
                </div>
            </div> */}

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
                {/* <div className="item">
                    <div>
                        <i className='bx bx-time'></i>
                        <div className="event-info">
                            <a href="#">Beginner Python</a>
                            <p>11:30-13:00</p>
                        </div>
                    </div>
                    <i className='bx bx-dots-horizontal-rounded'></i>
                </div>
                <div className="item">
                    <div>
                        <i className='bx bx-time'></i>
                        <div className="event-info">
                            <a href="#">Introduction to SQL</a>
                            <p>10:00-11:30</p>
                        </div>
                    </div>
                    <i className='bx bx-dots-horizontal-rounded'></i>
                </div> */}
            </div>

        </div>

      </div>

    </>
  )
}


function renderEventContent(eventInfo: { timeText: string; event: { title: string } }) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
}

export default App