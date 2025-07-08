// src/components/Navbar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/atoms/userAtom';
import {
    FaBook,
    FaHome,
    FaSignInAlt,
    FaUserPlus,
    FaUserCircle,

} from 'react-icons/fa';

const Navbar: React.FC = () => {
    const { user } = useRecoilValue(userState);
    const location = useLocation();


    const isActive = (path: string) => location.pathname === path;



    return (
        <nav className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] shadow-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <FaBook className="h-8 w-8 text-[#65a3e0] animate-pulse" />
                        <span className="ml-2 text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-400">
                            ShelfLib
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="">
                        <div className="ml-10 flex items-center space-x-1 flex-wrap">
                            <Link
                                to="/"
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 ${isActive('/')
                                    ? 'bg-gradient-to-r from-blue-600/30 to-indigo-700/30 text-white shadow-lg'
                                    : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'}`}
                            >
                                <FaHome className="mr-2" />
                                Home
                            </Link>


                            <Link
                                to="/lib"
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 ${isActive('/lib')
                                    ? 'bg-gradient-to-r from-blue-600/30 to-indigo-700/30 text-white shadow-lg'
                                    : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'}`}
                            >
                                <FaBook className="mr-2" />
                                Libraries
                            </Link>


                            <Link
                                to="/about"
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 ${isActive('/about')
                                    ? 'bg-gradient-to-r from-blue-600/30 to-indigo-700/30 text-white shadow-lg'
                                    : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'}`}
                            >
                                About
                            </Link>
                        </div>
                    </div>


                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {user?._id ? (
                                <Link
                                    to="/dashboard?tab=AdminDash"
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 flex items-center transition-all duration-200 hover:scale-105"
                                >
                                    <FaUserCircle className="mr-2" />
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex space-x-2">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-slate-800/50 flex items-center border border-slate-700 transition-all duration-200"
                                    >
                                        <FaSignInAlt className="mr-2" />
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 flex items-center transition-all duration-200 hover:scale-105"
                                    >
                                        <FaUserPlus className="mr-2" />
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>



                </div>
            </div>



        </nav>
    );
};

export default Navbar;