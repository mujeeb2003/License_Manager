import { useSelector } from "react-redux"
import type { RootState } from "../../types"

function LicenseTable() {
  const { licenses } = useSelector((state:RootState)=>state.license);
  
  return (
    <div className="bottom-container">
    <div className="popular">
        <div className="header">
            <h4>Licenses Yearly Overview</h4>
            <a aria-disabled># Expiry</a>
        </div>
        <div className="yearly-table">
            <table>
              <thead>
                <tr>
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
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{new Date().getFullYear()}</td>
                  {Array.from({length: 12}).map((_, i) => {
                    const style = i < new Date().getMonth() ? {color: 'var(--dark-grey)'} : {};
                    return (
                    <td key={i} style={style}>{licenses.filter(license => new Date(license.expiry_date).getFullYear() === new Date().getFullYear() && new Date(license.expiry_date).getMonth() === i).length}</td>
                  )
                  })}
                </tr>
                <tr>
                <td>{new Date().getFullYear()+1}</td>
                  {Array.from({length: 12}).map((_, i) => (
                    <td key={i}>{licenses.filter(license => new Date(license.expiry_date).getFullYear() === new Date().getFullYear()+1 && new Date(license.expiry_date).getMonth() === i).length}</td>
                  ))}
                </tr>
              </tbody>
            </table>
        </div>
        
    </div>

  </div>
  )
}

export default LicenseTable