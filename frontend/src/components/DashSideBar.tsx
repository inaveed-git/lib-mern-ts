import React from 'react';
import {
    FaBook,
    FaChartBar,
    FaCog,
    FaPlusCircle,
    FaSignOutAlt,
    FaBookOpen,
    FaList,
    FaShieldAlt
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../recoil/atoms/userAtom';
import axios from 'axios';

const DashSideBar: React.FC = () => {
    const location = useLocation();
    const { user } = useRecoilValue(userState);
    const isSuperAdmin = user?.isSuperAdmin;
    const setUser = useSetRecoilState(userState);
    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/user/signout`,
                { withCredentials: true }
            );

            // Clear user state
            setUser(null);

            // Redirect to home
            window.location.href = '/';  // Full page reload to clear all state
        } catch (error) {
            console.error('Signout failed:', error);
        }
    };

    return (
        <div className="fixed top-0 left-0 bottom-0 w-full md:w-56 bg-gradient-to-br from-[#1e3a5f] to-[#2d5182] text-white p-4 flex flex-col z-10 overflow-y-auto">
            <div className="p-4 mb-6 border-b border-[#2d5182]">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <FaBook className="text-[#65a3e0]" />
                    ShelfLib
                </h1>
            </div>

            <nav className="flex-1">
                <ul>
                    <li className="mb-1">
                        <Link
                            to="/dashboard?tab=AdminDash"
                            className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:translate-x-1 ${location.pathname + location.search === '/dashboard?tab=AdminDash'
                                ? 'bg-[rgba(101,163,224,0.2)] border-l-4 border-[#65a3e0]'
                                : ''
                                }`}
                        >
                            <span className="text-[#65a3e0] mr-3"><FaChartBar className="text-xl" /></span>
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    <li className="mb-1">
                        <Link
                            to="/dashboard?tab=create-book"
                            className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:translate-x-1 ${location.pathname + location.search === '/dashboard?tab=create-book'
                                ? 'bg-[rgba(101,163,224,0.2)] border-l-4 border-[#65a3e0]'
                                : ''
                                }`}
                        >
                            <span className="text-[#65a3e0] mr-3"><FaPlusCircle className="text-xl" /></span>
                            <span>Add New Book</span>
                        </Link>
                    </li>

                    <li className="mb-1">
                        <Link
                            to="/dashboard?tab=AdminBook"
                            className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:translate-x-1 ${location.pathname + location.search === '/dashboard?tab=AdminBook'
                                ? 'bg-[rgba(101,163,224,0.2)] border-l-4 border-[#65a3e0]'
                                : ''
                                }`}
                        >
                            <span className="text-[#65a3e0] mr-3"><FaBook className="text-xl" /></span>
                            <span>Manage Books</span>
                        </Link>
                    </li>

                    <li className="mb-1">
                        <Link
                            to="/dashboard?tab=BookList"
                            className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:translate-x-1 ${location.pathname + location.search === '/dashboard?tab=BookList'
                                ? 'bg-[rgba(101,163,224,0.2)] border-l-4 border-[#65a3e0]'
                                : ''
                                }`}
                        >
                            <span className="text-[#65a3e0] mr-3"><FaList className="text-xl" /></span>
                            <span>Books List</span>
                        </Link>
                    </li>

                    <li className="mb-1">
                        <Link
                            to="/dashboard?tab=my-libraries"
                            className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:translate-x-1 ${location.pathname + location.search === '/dashboard?tab=my-libraries'
                                ? 'bg-[rgba(101,163,224,0.2)] border-l-4 border-[#65a3e0]'
                                : ''
                                }`}
                        >
                            <span className="text-[#65a3e0] mr-3"><FaBookOpen className="text-xl" /></span>
                            <span>My Libraries</span>
                        </Link>
                    </li>

                    <li className="mb-1">
                        <Link
                            to="/dashboard?tab=create-library"
                            className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:translate-x-1 ${location.pathname + location.search === '/dashboard?tab=create-library'
                                ? 'bg-[rgba(101,163,224,0.2)] border-l-4 border-[#65a3e0]'
                                : ''
                                }`}
                        >
                            <span className="text-[#65a3e0] mr-3"><FaPlusCircle className="text-xl" /></span>
                            <span>Create Library</span>
                        </Link>
                    </li>

                    {isSuperAdmin && (
                        <li className="mb-1">
                            <Link
                                to="/super-admin"
                                className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:translate-x-1 ${location.pathname === '/super-admin'
                                    ? 'bg-[rgba(101,163,224,0.2)] border-l-4 border-[#65a3e0]'
                                    : ''
                                    }`}
                            >
                                <span className="text-[#65a3e0] mr-3"><FaShieldAlt className="text-xl" /></span>
                                <span>Super Admin</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>

            <div className="mt-auto p-3 bg-[rgba(0,0,0,0.2)] rounded-lg border-l-4 border-[#65a3e0]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        <div>
                            <p className="font-medium">{user?.username || 'User'}</p>
                            <p className="text-xs text-[#a0c5e8]">
                                {isSuperAdmin ? 'Super Admin' : 'User'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignout}
                        className="text-[#65a3e0] hover:text-[#a0c5e8] transition-colors"
                        title="Sign out"
                    >
                        <FaSignOutAlt />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashSideBar;