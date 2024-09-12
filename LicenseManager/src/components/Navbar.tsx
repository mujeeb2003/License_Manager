import { Button, Menu, MenuButton,MenuGroup, MenuItem, MenuList } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { Link, useLocation} from 'react-router-dom';
import { AppDispatch } from '../types';
import { logoutUser } from '../redux/user/userSlice';

function Navbar() {
  const location = useLocation();
  const isActive = (path:string) => location.pathname === path;
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
        <Link to="/home/dashboard" id={isActive('/home/dashboard') ? 'isactive' : ''}>Dashboard</Link>
        <Link to="/home/licenses"  id={isActive('/home/licenses') ? 'isactive' : ''}>Licenses</Link>
        <Link to="/home/vendors"  id={isActive('/home/vendors') ? 'isactive' : ''}>Vendors</Link>
        <Link to="/home/category"  id={isActive('/home/category') ? 'isactive' : ''}>Category</Link>
      </div>

      <div className="right-section">
        <i className='bx bx-bell'></i>
        <i className='bx bx-search'></i>

        <div className="profile">
              <Menu size={"sm"}>
                <MenuButton as={Button} colorScheme=''>
                  <img src="assets/profile.png" alt="" />
                  {/* Profile */}
                  <i className='bx bx-chevron-down' style={{fontSize:"22px"}}></i>
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
