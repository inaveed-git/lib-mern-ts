import React, { useEffect, useState } from 'react'
import { FaBook, FaBookOpen } from 'react-icons/fa6'
import axios from 'axios'
import { useRecoilValue } from 'recoil'
import { userState } from '../recoil/atoms/userAtom'
import { usePageTitle } from '../hook/usePageTitle';


interface DashboardStats {
    userBookCount: number;
    userLibraryCount: number;
    publicBookCount: number;
    publicLibraryCount: number;
}

const AdminDashboard = () => {

    usePageTitle("DashBoard")

    const { user } = useRecoilValue(userState);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // In AdminDashboard.tsx
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/book/dashboard-stats`,
                    { withCredentials: true }
                );

                console.log("Dashboard stats response:", response.data); // Add this for debugging

                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (err: any) {
                // ... error handling
            } finally {
                setLoading(false);
            }
        };

        if (user) { // Remove token check since auth is cookie-based
            fetchStats();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-800/70 text-red-100 p-4 rounded-lg mb-6 flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
                {error}
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                {/* User's Books */}
                <div className="bg-[rgba(26,32,44,0.7)] rounded-xl p-5 border-l-4 border-[#65a3e0]">
                    <div className="flex justify-between items-center">
                        {/* <span className="text-9xl bg-red-600">check</span> */}
                        <div>
                            <p className="text-[#a0aec0]">Your Books</p>
                            <p className="text-3xl font-bold">
                                {stats?.userBookCount ?? 0}
                            </p>
                        </div>
                        <div className="bg-[#65a3e0] p-3 rounded-lg">
                            <FaBook className="text-2xl" />
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-[#65a3e0] flex items-center">
                        <span className="inline-block mr-1">↑</span> Your personal collection
                    </p>
                </div>

                {/* Public Books */}
                <div className="bg-[rgba(26,32,44,0.7)] rounded-xl p-5 border-l-4 border-[#4ade80]">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[#a0aec0]">Public Books</p>
                            <p className="text-3xl font-bold">
                                {stats?.publicBookCount ?? 0}
                            </p>
                        </div>
                        <div className="bg-[#4ade80] p-3 rounded-lg">
                            <FaBookOpen className="text-2xl" />
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-[#4ade80] flex items-center">
                        <span className="inline-block mr-1">↑</span> Shared by community
                    </p>
                </div>

                {/* Libraries */}
                <div className="bg-[rgba(26,32,44,0.7)] rounded-xl p-5 border-l-4 border-[#f87171]">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[#a0aec0]">Your Libraries</p>
                            <p className="text-3xl font-bold">
                                {stats?.userLibraryCount ?? 0}
                            </p>
                        </div>
                        <div className="bg-[#f87171] p-3 rounded-lg">
                            <FaBookOpen className="text-2xl" />
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-[#f87171] flex items-center">
                        <span className="inline-block mr-1">↑</span> Your collections
                    </p>
                </div>
            </div>

            {/* Public Libraries Stats */}
            <div className="mt-8 bg-[rgba(26,32,44,0.7)] rounded-xl p-5 border-l-4 border-[#a78bfa]">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-[#a0aec0]">Public Libraries</p>
                        <p className="text-3xl font-bold">
                            {stats?.publicLibraryCount ?? 0}
                        </p>
                    </div>
                    <div className="bg-[#a78bfa] p-3 rounded-lg">
                        <FaBookOpen className="text-2xl" />
                    </div>
                </div>
                <p className="mt-2 text-sm text-[#a78bfa] flex items-center">
                    <span className="inline-block mr-1">↑</span> Community collections
                </p>
            </div>
        </>
    )
}

export default AdminDashboard