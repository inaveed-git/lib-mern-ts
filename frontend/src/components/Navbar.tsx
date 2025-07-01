// src/components/Navbar.tsx (optional addition)
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/userAtom";

const Navbar: React.FC = () => {
    const { user } = useRecoilValue(userState);
    const location = useLocation();

    // Don't show navbar on auth pages
    if (location.pathname === "/login") {
        return null;
    }

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-blue-600">
                                BookHub
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className={`border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === "/" ? "border-b-2" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Libraries
                            </Link>
                            {user && (
                                <Link
                                    to="/dashboard"
                                    className={`border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === "/dashboard" ? "border-b-2" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    My Books
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user ? (
                            <div className="ml-3 relative">
                                <div className="flex items-center space-x-4">
                                    {user.isAdmin && (
                                        <Link
                                            to="/admin-dashboard"
                                            className="text-sm text-gray-700 hover:text-gray-900"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                                    >
                                        <span className="mr-2">Hi, {user.username}</span>
                                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center">
                                            <span className="text-xs font-bold text-gray-600">
                                                {user.username.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;