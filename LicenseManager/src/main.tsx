import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Button from "@mui/material/Button"
import {LinearProgress} from "@mui/material"
import './index.css'
import { Calendar } from './components/newCalendar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     {/* <Button variant="contained">Hello world</Button>
     <LinearProgress variant="determinate" value={50} /> */}
      {/* <Calendar /> */}
      {/* <Calendar/> */}

    <App />
  </StrictMode>,
)
