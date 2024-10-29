import { Progress } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../types'


function LicenseStatus() {
    const { licenses } = useSelector((state:RootState)=>state.license);
  return (
    <div className="status">
        <div className="header">
            <h4 id="big">Dashboard</h4>
            <h4 id="small">Statistics</h4>
        </div>

        <div className="items-list">
            
            <div className="item">
                <div className="info">
                    <div>
                        <h5>Up to Date</h5>
                        {/* <p>- 3 SLA</p> */}
                        {/* <p>- 1 PAM</p> */}
                    </div>
                    <p id="iteminfo" style={{color: "var(--primary)"}}>{licenses.filter((license)=>license['Status.status_name'] === "Up to Date").length.toString()}</p>
                </div>
            </div>
            <div className="item">
                <div className="info">
                    <div>
                        <h5>Near to Expiry</h5>
                        {/* <p>- 2 SLA</p> */}
                        {/* <p>- 5 PAM</p> */}
                    </div>
                    <p id="iteminfo" style={{color: "var(--warning)"}}>{licenses.filter((license)=>license['Status.status_name'] === "Near to Expiry").length.toString()}</p>
                </div>
            </div>
            <div className="item">
                <div className="info">
                    <div>
                        <h5>Expired</h5>
                        {/* <p>- 4 SLA</p> */}
                        {/* <p>- 8 PAM</p> */}
                    </div>
                    <p id="iteminfo" style={{color: "var(--danger)"}}>{licenses.filter((license)=>license['Status.status_name'] === "Expired").length.toString()}</p>
                </div>
            </div>

            <div className="item" style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                <span style={{color:'#ccc'}}>
                    <p>Up to Date<span style={{float:'right',color:'var(--primary)'}}>{((licenses.filter((license)=>license['Status.status_name'] === "Up to Date").length / licenses.length * 100) || 0).toPrecision(2)}%</span></p> 
                    <Progress isAnimated hasStripe value={(licenses.filter((license)=>license['Status.status_name'] === "Up to Date").length / licenses.length * 100) || 0} colorScheme='blue' />
                </span>
                <span style={{color:'#ccc'}}>
                    <p>Near to expiry<span style={{float:'right',color:'var(--warning)'}}>{((licenses.filter((license)=>license['Status.status_name'] === "Near to Expiry").length / licenses.length * 100) || 0).toPrecision(2)}%</span></p>
                    <Progress isAnimated hasStripe value={(licenses.filter((license)=>license['Status.status_name'] === "Near to Expiry").length / licenses.length * 100) || 0} colorScheme='yellow'/>
                </span>
                <span style={{color:'#ccc'}}>
                    <p>Expired<span style={{float:'right',color:'var(--danger)'}}>{((licenses.filter((license)=>license['Status.status_name'] === "Expired").length / licenses.length * 100) || 0).toPrecision(2)}%</span></p>
                    <Progress isAnimated hasStripe value={(licenses.filter((license)=>license['Status.status_name'] === "Expired").length / licenses.length * 100) || 0} colorScheme='red'/>
                </span>
                {/* <canvas className="activity-chart"></canvas> */}
            </div>
        </div>
    </div>
  )
}

export default LicenseStatus