import React, { useEffect } from 'react'
import LicenseCalendar from './subComponents/LicenseCalendar'
import LicenseNot from './subComponents/LicenseNot'
import LicenseStatus from './subComponents/LicenseStatus'
import LicenseTable from './subComponents/LicenseTable'
import { getLicenseOpt, getLicenses } from '../redux/license/licenseSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../types'

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(getLicenseOpt());
    dispatch(getLicenses());
  }, [dispatch]);
  
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