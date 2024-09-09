import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="nav">
      <div className="logo">
        <Link to="/"><img src="../public/logo.png" alt="" style={{width: "auto", height: "40px"}}/></Link>
        {/* <i className='bx bxl-codepen'></i>
        <Link to="/">4Sight Technologies</Link> */}
      </div>

      <div className="nav-links">
        <Link to="/home/dashboard">Dashboard</Link>
        <Link to="/home/licenses">Licenses</Link>
        <Link to="/home/category">Category</Link>
        <Link to="/home/vendors">Vendors</Link>
      </div>

      <div className="right-section">
        <i className='bx bx-bell'></i>
        <i className='bx bx-search'></i>

        <div className="profile">
          <div className="info">
            <img src="assets/profile.png" alt="Profile" />
            <div>
              <Link to="#">Alex Johnson</Link>
              <p>Data Scientist</p>
            </div>
          </div>
          <i className='bx bx-chevron-down'></i>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
