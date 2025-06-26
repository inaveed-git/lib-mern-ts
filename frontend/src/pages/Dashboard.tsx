import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminManageBooks from "./AdminManageBooks";
import AdminViewMyLibrary from "./AdminViewMyLibrary";
import DashSideBar from "../components/DashSideBar";
import { FaBook, FaBookOpen, FaUser } from "react-icons/fa6";
import AddBookForm from "../components/AddBookForm";

const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        if (tabFromUrl) setTab(tabFromUrl);
    }, [location.search]);

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[#0f1a2f] to-[#1a2a3a] text-white">
            <DashSideBar />

            <div className="flex-1 p-6 min-h-screen">
                {/* Header */}
                <header className="mb-6 p-4 bg-[rgba(26,32,44,0.7)] rounded-xl shadow-lg">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold  bg-red-500">
                            {tab === "AdminDash" && "Dashboard"}
                            {tab === "create-book" && "New Book"}
                            {tab === "AdminLibrary" && "My Library"}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="py-2 pl-10 pr-4 bg-[#0f172a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65a3e0]"
                                />
                                <svg
                                    className="absolute left-3 top-2.5 text-[#a0aec0]"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                </svg>
                            </div>
                            <button className="bg-[#65a3e0] hover:bg-[#4a8bc9] p-2 rounded-full">
                                <svg
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>



                {/* Tab Content */}
                <div className="bg-[rgba(26,32,44,0.7)] rounded-xl shadow-lg p-6 min-h-[50vh]">
                    {tab === "AdminDash" && <AdminDashboard />}
                    {tab === "create-book" && <AddBookForm />}
                    {tab === "AdminLibrary" && <AdminManageBooks />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;