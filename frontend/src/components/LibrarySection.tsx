import React from 'react'
import { FaCirclePlus } from "react-icons/fa6";

import { FaBook } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import { IoIosRefreshCircle } from "react-icons/io";
import { FaLink } from "react-icons/fa6";





const LibrarySection: React.FC = () => {
    return (
        <div className='flex-1 bg-gradient-to-br from-[#1e3a5f] to-[#2d5182] flex  flex-col text-white p-10'>

            <div className='text-lg'>
                <p>Create your personal digital library. Organize, share and access your books, PDFs, and images from anywhere.</p>
            </div>
            <div>
                <ul className='relative z-10 p-3.5'>
                    {[

                        {
                            icon: <FaCirclePlus />
                            , text: 'Build your personal digital library'
                        },
                        { icon: <FaBook />, text: 'Upload books, PDFs, and images' },
                        { icon: <FaLock />, text: 'Control access with private or public  sharing' },
                        { icon: <IoIosRefreshCircle className='text-2xl' />, text: 'added text' },


                    ].map((item, index) => (
                        <li
                            key={index}
                            className="mb-3 mt-3 flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:translate-x-1 space-x-3.5"
                        >
                            <span className='text-xl text-[#65a3e0]'>{item.icon}</span>
                            <h1>{item.text}</h1>
                        </li>
                    ))}




                </ul>
            </div>
            <div className="mt-3 bg-[rgba(0,0,0,0.2)] p-4 rounded-xl border-l-4 border-[#65a3e0] relative z-10 ">
                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                    <FaLink />

                    Shareable Library Links
                </h3>
                <p className="text-base">
                    Create unique links to share your entire library or specific books
                    with friends, students, or colleagues.
                </p>
            </div>


        </div>
    )
}

export default LibrarySection