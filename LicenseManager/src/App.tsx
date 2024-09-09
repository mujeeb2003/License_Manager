import React from 'react'
import "./App.css";
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Registration from './components/Registration';
import License from './components/License';
import Vendor from './components/Vendor';
import Category from './components/Category';

function App() {
    // Sample events

  return (
    <>
      <Router>
        <Routes>
          <Route>
            <Route path="/" element={<Registration />} />
          </Route>
          <Route path="/home/*" element={
            <>
              <div className="top-container">
                <Navbar />
              </div>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/Licenses" element={<License />} />
                <Route path="/Vendor" element={<Vendor />} />
                <Route path="/Category" element={<Category />} />
              </Routes>
            </>
          }>
          </Route>
        </Routes>
      </Router>
      
    </>
  )
}



export default App