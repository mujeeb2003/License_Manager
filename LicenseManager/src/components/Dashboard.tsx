import { useEffect } from "react";
import LicenseCalendar from "./subComponents/LicenseCalendar";
import LicenseNot from "./subComponents/LicenseNot";
import LicenseStatus from "./subComponents/LicenseStatus";
import LicenseTable from "./subComponents/LicenseTable";
import {
    getLicenseOpt,
    getLicenses,
    getLicenseNot,
} from "../redux/license/licenseSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../types";
import { ToastContainer, toast } from "react-toastify";
import {  useLocation } from "react-router-dom";

function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    useEffect(() => {
        if (location.state?.message) {
            toast.info(location.state.message);
            window.history.replaceState({}, document.title);
        }
        dispatch(getLicenseOpt());
        dispatch(getLicenses());
        dispatch(getLicenseNot());
    }, [dispatch]);

    return (
        <>
            <ToastContainer autoClose={3000} theme="colored" stacked={true} />
            <div className="top-container">
                <LicenseStatus />
            </div>
            <LicenseTable />
            <div className="bottom-container">
                <LicenseCalendar />
                <LicenseNot />
            </div>
        </>
    );
}

export default Dashboard;
