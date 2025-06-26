import React from 'react'
import { FaBook, FaBookOpen, FaUser } from 'react-icons/fa6'

const AdminDashboard = () => {
    return (


        <>



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Stats Cards */}
                <div className="bg-[rgba(26,32,44,0.7)] rounded-xl p-5 border-l-4 border-[#65a3e0]">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[#a0aec0]">Total Books</p>
                            <p className="text-3xl font-bold">1,248</p>
                        </div>
                        <div className="bg-[#65a3e0] p-3 rounded-lg">
                            <FaBook className="text-2xl" />
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-[#65a3e0] flex items-center">
                        <span className="inline-block mr-1">↑</span> 12% from last month
                    </p>
                </div>

                <div className="bg-[rgba(26,32,44,0.7)] rounded-xl p-5 border-l-4 border-[#4ade80]">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[#a0aec0]">Active Users</p>
                            <p className="text-3xl font-bold">342</p>
                        </div>
                        <div className="bg-[#4ade80] p-3 rounded-lg">
                            <FaUser className="text-2xl" />
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-[#4ade80] flex items-center">
                        <span className="inline-block mr-1">↑</span> 8% from last month
                    </p>
                </div>

                <div className="bg-[rgba(26,32,44,0.7)] rounded-xl p-5 border-l-4 border-[#f87171]">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[#a0aec0]">Overdue Books</p>
                            <p className="text-3xl font-bold">27</p>
                        </div>
                        <div className="bg-[#f87171] p-3 rounded-lg">
                            <FaBookOpen className="text-2xl" />
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-[#f87171] flex items-center">
                        <span className="inline-block mr-1">↓</span> 3% from last month
                    </p>
                </div>
            </div>



        </>
    )
}

export default AdminDashboard