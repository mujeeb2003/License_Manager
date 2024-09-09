import React from 'react'

function LicenseTable() {
  return (
    <div className="bottom-container">
    <div className="popular">
        <div className="header">
            <h4>Licenses Yearly Overview</h4>
            <a href="#"># Expiry</a>
        </div>
        <div className="yearly-table">
            <table>
              <thead>
                <td></td>
                <td>Jan</td>
                <td>Feb</td>
                <td>Mar</td>
                <td>Apr</td>
                <td>May</td>
                <td>Jun</td>
                <td>Jul</td>
                <td>Aug</td>
                <td>Sep</td>
                <td>Oct</td>
                <td>Nov</td>
                <td>Dec</td>
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
  )
}

export default LicenseTable