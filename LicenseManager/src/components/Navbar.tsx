import { Button, Menu, MenuButton,MenuGroup, MenuItem, MenuList } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { AppDispatch } from '../types';
import { logoutUser } from '../redux/user/userSlice';
import { toast, ToastContainer } from 'react-toastify';

function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = async () => {
    const res = await dispatch(logoutUser());
    if(res.payload.message){
      // toast.success(res.payload.message);
      window.location.href = "/";
    }
  }
  
  return (
    <div className="nav">
      <div className="logo">
        <Link to="/"><img src="../public/logo.png" alt="" style={{width: "auto", height: "40px"}}/></Link>
        
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
              <Menu>
                <MenuButton as={Button} colorScheme=''>
                  <img src="assets/profile.png" alt="" />
                  {/* Profile */}
                  <i className='bx bx-chevron-down' style={{fontSize:"28px"}}></i>
                </MenuButton>
                <MenuList>
                  <MenuGroup title='Profile'>
                    <MenuItem>My Account</MenuItem>
                    <MenuItem onClick={()=>handleLogout()}>Logout</MenuItem>
                  </MenuGroup>
                </MenuList>
              </Menu>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
