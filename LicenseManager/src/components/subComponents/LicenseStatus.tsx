import React from 'react'
import { Progress } from '@chakra-ui/react'


function LicenseStatus() {
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
                    <p>- 3 SLA</p>
                    <p>- 1 PAM</p>
                </div>
                <p id="iteminfo" style={{color: "var(--primary)"}}>10</p>
            </div>
        </div>
        <div className="item">
            <div className="info">
                <div>
                    <h5>Near to Expiry</h5>
                    <p>- 2 SLA</p>
                    <p>- 5 PAM</p>
                </div>
                <p id="iteminfo" style={{color: "var(--warning)"}}>10</p>
            </div>
        </div>
        <div className="item">
            <div className="info">
                <div>
                    <h5>Expired</h5>
                    <p>- 4 SLA</p>
                    <p>- 8 PAM</p>
                </div>
                <p id="iteminfo" style={{color: "var(--danger)"}}>10</p>
            </div>
        </div>

        <div className="item" style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <span style={{color:'#ccc'}}>
                <p>Up to Date<span style={{float:'right',color:'var(--primary)'}}>50%</span></p> 
                <Progress hasStripe value={50} colorScheme='blue' />
            </span>
            <span style={{color:'#ccc'}}>
                <p>Near to expiry<span style={{float:'right',color:'var(--warning)'}}>70%</span></p>
                <Progress hasStripe value={70} colorScheme='yellow'/>
            </span>
            <span style={{color:'#ccc'}}>
                <p>Expired<span style={{float:'right',color:'var(--danger)'}}>80%</span></p>
                <Progress hasStripe value={80} colorScheme='red'/>
            </span>
            {/* <canvas className="activity-chart"></canvas> */}
        </div>
    </div>

  </div>
  )
}

export default LicenseStatus