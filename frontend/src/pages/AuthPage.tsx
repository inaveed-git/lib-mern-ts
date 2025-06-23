import React, { useState } from 'react'
import LibrarySection from '../components/LibrarySection'
import FormSection from '../components/FormSection'

const AuthPage: React.FC = () => {

    const [activeTab, setActiveTab] = useState("signin");

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a2a3a] to-[#2c3e50] flex justify-center items-center relative ">


            <div className="w-full max-w-5xl  bg-[rgba(26,32,44,0.92)] rounded-xl shadow-2xl overflow-x-hidden overflow-y-hidden relative border border-[rgba(101,163,224,0.2)] backdrop-blur-md z-10 flex flex-col md:flex-row">
                <LibrarySection />
                <FormSection activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
        </div>
    )
}

export default AuthPage