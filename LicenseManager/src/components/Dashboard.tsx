import React from 'react'
import LicenseCalendar from './subComponents/LicenseCalendar'
import LicenseNot from './subComponents/LicenseNot'
import LicenseStatus from './subComponents/LicenseStatus'
import LicenseTable from './subComponents/LicenseTable'

function Dashboard() {
  return (
    <>
      <div className='top-container'>
        <LicenseStatus/>
      </div>
      <LicenseTable/>
      <div className="bottom-container">
        <LicenseCalendar/>
        <LicenseNot/>
          
      </div>
    </>
  )
}

export default Dashboard