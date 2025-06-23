import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import AdminDashboard from "./AdminDashboard";
import AdminManageBooks from "./AdminManageBooks";
import AdminViewMyLibrary from "./AdminViewMyLibrary";
import DashSideBar from "../components/DashSideBar";

const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="md:w-56">
                <DashSideBar />
            </div>

            <div className="flex-1 p-4">
                {tab === "AdminDash" && <AdminDashboard />}
                {tab === "AdminMangeBooks" && <AdminManageBooks />}
                {tab === "AdminLibrary" && <AdminViewMyLibrary />}
                {/* Add more as needed */}
            </div>
        </div>
    );
};

export default Dashboard;
