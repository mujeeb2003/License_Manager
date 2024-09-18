import "./App.css";
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import License from './components/License';
import Vendor from './components/Vendor';
import Category from './components/Category';
import Registration from './components/Registration';
import ProtectedLoginRoute, { ProtectedRoute } from "./utils/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, type RootState } from "./types";
import { getLoggedinUser } from "./redux/user/userSlice";
import { useEffect } from "react";
import UserManagementComponent from "./components/UserManagement";
import ProfilePage from "./components/Profile";

function App() {
  const {isSuperAdmin} = useSelector((state:RootState)=>state.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getLoggedinUser());
  }, [dispatch])

  return (
    <>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute/>}>
            <Route path="/" element={<Registration />} />
          </Route>
          <Route element={<ProtectedLoginRoute/>}>
            <Route path="/home/*" element={
              <>
                <div className="top-container">
                  <Navbar />
                </div>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/Licenses" element={<License />} />
                  <Route path="/Vendors" element={<Vendor />} />
                  <Route path="/Category" element={<Category />} />
                  {isSuperAdmin && <Route path="/userManagement" element={<UserManagementComponent />} />}
                  <Route path="/profile" element={<ProfilePage />}/>
                </Routes>
              </>
            }>
            </Route>
          </Route>
        </Routes>
      </Router>
      
    </>
  )
}



export default App