import React, { useEffect, useState } from "react";
import {
    HiAnnotation,
    HiArrowSmRight,
    HiChartPie,
    HiDocumentText,
    HiOutlineUserGroup,
    HiUser,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

function DashSideBar() {
    const isAdmin = true; // Dummy logic
    const userRole = isAdmin ? "Admin" : "User";
    const location = useLocation();
    const [tab, setTab] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        if (tabFromUrl) setTab(tabFromUrl);
    }, [location.search]);

    return (
        <div className="w-full md:w-56 bg-white border-r h-full p-4">
            <ul className="space-y-2">
                {isAdmin && (
                    <li>
                        <Link
                            to="/dashboard?tab=AdminDash"
                            className={`flex items-center px-3 py-2 rounded-lg transition ${tab === "AdminDash"
                                ? "bg-blue-100 text-blue-600 font-semibold"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <HiChartPie className="w-5 h-5 mr-3" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                )}

                <li>
                    <Link
                        to="/dashboard?tab=AdminMangeBooks"
                        className={`flex items-center px-3 py-2 rounded-lg transition ${tab === "AdminMangeBooks"
                            ? "bg-blue-100 text-blue-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        <HiUser className="w-5 h-5 mr-3" />
                        <span>Manage Books</span>
                        <span className="ml-auto text-xs text-gray-500">{userRole}</span>
                    </Link>
                </li>

                {isAdmin && (
                    <li>
                        <Link
                            to="/dashboard?tab=AdminLibrary"
                            className={`flex items-center px-3 py-2 rounded-lg transition ${tab === "AdminLibrary"
                                ? "bg-blue-100 text-blue-600 font-semibold"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <HiDocumentText className="w-5 h-5 mr-3" />
                            <span>My Library</span>
                        </Link>
                    </li>
                )}

                {/* Optional extra routes */}
                {isAdmin && (
                    <>
                        <li>
                            <Link
                                to="/dashboard?tab=users"
                                className={`flex items-center px-3 py-2 rounded-lg transition ${tab === "users"
                                    ? "bg-blue-100 text-blue-600 font-semibold"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <HiOutlineUserGroup className="w-5 h-5 mr-3" />
                                <span>Users</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/dashboard?tab=comments"
                                className={`flex items-center px-3 py-2 rounded-lg transition ${tab === "comments"
                                    ? "bg-blue-100 text-blue-600 font-semibold"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <HiAnnotation className="w-5 h-5 mr-3" />
                                <span>Comments</span>
                            </Link>
                        </li>
                    </>
                )}

                <li>
                    <button className="flex items-center w-full px-3 py-2 text-left rounded-lg text-red-600 hover:bg-red-50 transition">
                        <HiArrowSmRight className="w-5 h-5 mr-3" />
                        <span>Sign Out</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default DashSideBar;
