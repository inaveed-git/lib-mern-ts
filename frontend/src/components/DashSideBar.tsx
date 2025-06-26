import React from 'react';
import {
    FaBook,
    FaChartBar,
    FaCog,
    FaPlusCircle,
    FaSignOutAlt,
    FaUser,
    FaBookOpen
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const DashSideBar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        {
            icon: <FaChartBar className="text-xl" />,
            text: 'Dashboard',
            path: '/dashboard?tab=AdminDash'
        },


        {
            icon: <FaPlusCircle className="text-xl" />,
            text: 'Add New Book',
            path: '/dashboard?tab=create-book'
        },
        {
            icon: <FaBook className="text-xl" />,
            text: 'Manage Books',
            path: '/dashboard?tab=AdminMangeBooks'
        },
        {
            icon: <FaBookOpen className="text-xl" />,
            text: 'My Library',
            path: '/dashboard?tab=AdminLibrary'
        },

        {
            icon: <FaUser className="text-xl" />,
            text: 'User Management',
            path: '/users'
        },
        {
            icon: <FaCog className="text-xl" />,
            text: 'Settings',
            path: '/settings'
        },
    ];

    return (
        <div className="w-full md:w-56 h-screen bg-gradient-to-br from-[#1e3a5f] to-[#2d5182] text-white p-4 flex flex-col">
            {/* Logo/Header */}
            <div className="p-4 mb-6 border-b border-[#2d5182]">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <FaBook className="text-[#65a3e0]" />
                    ShelfLib
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1">
                <ul>
                    {navItems.map((item, index) => (
                        <li key={index} className="mb-1">
                            <Link
                                to={item.path}
                                className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:translate-x-1 space-x-3 ${location.pathname + location.search === item.path
                                    ? 'bg-[rgba(101,163,224,0.2)] border-l-4 border-[#65a3e0]'
                                    : ''
                                    }`}
                            >
                                <span className="text-[#65a3e0]">{item.icon}</span>
                                <span>{item.text}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer/User */}
            <div className="mt-auto p-3 bg-[rgba(0,0,0,0.2)] rounded-lg border-l-4 border-[#65a3e0]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-xs text-[#a0c5e8]">Admin</p>
                        </div>
                    </div>
                    <button className="text-[#65a3e0] hover:text-[#a0c5e8] transition-colors">
                        <FaSignOutAlt />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashSideBar;