import { useSelector } from "react-redux";
import type { RootState } from "../types";
import {Outlet,Navigate} from "react-router-dom";
import {toast} from "react-toastify"

export default function ProtectedLoginRoute() {
    const { user } = useSelector((state:RootState)=>state.user);
    const isLogged = user.user_id!=0;
    toast.dismiss();
    !isLogged && toast.error("Please Login First");
    return isLogged ? <Outlet/> : <Navigate to="/"/>
    
}

export function ProtectedRoute(){
    const { user } = useSelector((state:RootState)=>state.user);
    const isLogged = user.user_id != 0;

    return isLogged ? <Navigate to="/home/dashboard"/> : <Outlet/>
}