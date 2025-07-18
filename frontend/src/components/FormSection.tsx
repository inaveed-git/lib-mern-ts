import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import type { UserType } from "../recoil/atoms/userAtom";
import { userState } from "../recoil/atoms/userAtom";
import { useNavigate } from "react-router-dom";
import {
    FaEnvelope,
    FaLock,
    FaUser,
    FaEye,
    FaEyeSlash,
    FaBookOpen,
    FaSignInAlt,
    FaPlusCircle,
    FaSpinner
} from "react-icons/fa";

interface FormSectionProps {
    activeTab: "signin" | "signup";
    setActiveTab: (tab: "signin" | "signup") => void;
}

const FormSection: React.FC<FormSectionProps> = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();
    const [showSignInPassword, setShowSignInPassword] = useState<boolean>(false);
    const [showSignUpPassword, setShowSignUpPassword] = useState<boolean>(false);
    const setAuthState = useSetRecoilState(userState);
    const { user } = useRecoilValue(userState);
    const [isSignInLoading, setIsSignInLoading] = useState(false);
    const [isSignUpLoading, setIsSignUpLoading] = useState(false);

    const [signupData, setSignupData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [signInData, setSignInData] = useState({
        email: "",
        password: "",
    });


    useEffect(() => {
        if (user) {
            navigate("/dashboard?tab=AdminDash");
        }
    }, [user, navigate]);

    const handleSignInForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignInData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignInSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSignInLoading(true);
        try {
            const response = await axios.post<{ user: UserType }>(
                `${import.meta.env.VITE_API_URL}/api/v1/user/signin`,
                signInData,
                { withCredentials: true }
            );


            setAuthState({
                user: response.data.user,
                isLoading: false
            });

            // Clear sign-in form data
            setSignInData({ email: "", password: "" });

        } catch (error) {
            console.error("Sign-in error:", error);
            // Optionally show error message to user
        } finally {
            setIsSignInLoading(false);
        }
    };

    const handleSignUpForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignupData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSignUpLoading(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/user/signup`,
                signupData
            );
            setActiveTab("signin");


            setSignupData({ username: "", email: "", password: "" });

        } catch (error) {
            console.error("Signup error:", error);

        } finally {
            setIsSignUpLoading(false);
        }
    };

    return (
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
                {/* Tabs */}
                <div className="flex border-b-2 border-[#2d3748] mb-8">
                    {["signin", "signup"].map((tab) => (
                        <button
                            key={tab}
                            className={`py-3 px-6 font-semibold transition-all duration-300 relative ${activeTab === tab ? "text-[#65a3e0]" : "text-[#a0aec0]"
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "signin" ? "Sign In" : "Sign Up"}
                            {activeTab === tab && (
                                <div className="absolute bottom-[-2px] left-0 w-full h-[3px] bg-[#65a3e0] rounded-t"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Sign In Form */}
                <form
                    className={`${activeTab === "signin" ? "block" : "hidden"
                        } animate-fadeIn`}
                    onSubmit={handleSignInSubmit}
                >
                    <h2 className="text-2xl text-[#f8fafc] mb-6 flex items-center gap-2">
                        <FaBookOpen className="text-[#65a3e0]" />
                        Access Your Library
                    </h2>

                    <div className="mb-5 relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a0aec0]">
                            <FaEnvelope />
                        </div>
                        <input
                            type="email"
                            className="w-full py-3 pl-12 pr-4 border border-[#2d3748] rounded-lg text-[#f1f5f9] bg-[rgba(26,32,44,0.7)] focus:border-[#65a3e0] focus:ring-2 focus:ring-[rgba(101,163,224,0.1)] outline-none transition-all"
                            placeholder="Email Address"
                            onChange={handleSignInForm}
                            name="email"
                            value={signInData.email}
                            required
                        />
                    </div>

                    <div className="mb-5 relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a0aec0]">
                            <FaLock />
                        </div>
                        <input
                            type={showSignInPassword ? "text" : "password"}
                            className="w-full py-3 pl-12 pr-12 border border-[#2d3748] rounded-lg text-[#f1f5f9] bg-[rgba(26,32,44,0.7)] focus:border-[#65a3e0] focus:ring-2 focus:ring-[rgba(101,163,224,0.1)] outline-none transition-all"
                            placeholder="Password"
                            required
                            onChange={handleSignInForm}
                            name="password"
                            value={signInData.password}
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#a0aec0]"
                            onClick={() => setShowSignInPassword(!showSignInPassword)}
                        >
                            {showSignInPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="flex justify-between items-center mb-6 text-sm">
                        <a
                            href="#"
                            className="text-[#65a3e0] hover:text-[#a0c5e8] hover:underline transition-colors"
                        >
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isSignInLoading}
                        className={`w-full py-3 bg-gradient-to-r from-[#3a7bd5] to-[#65a3e0] text-white rounded-lg font-semibold shadow-lg hover:from-[#2a5faf] hover:to-[#3a7bd5] hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${isSignInLoading ? "opacity-75 cursor-not-allowed" : "hover:-translate-y-0.5"
                            }`}
                    >
                        {isSignInLoading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Accessing...
                            </>
                        ) : (
                            <>
                                <FaSignInAlt />
                                Access My Library
                            </>
                        )}
                    </button>

                    <p className="text-center text-[#a0aec0] text-sm mt-7">
                        Don't have a library?{" "}
                        <button
                            type="button"
                            className="text-[#65a3e0] font-semibold hover:text-[#a0c5e8] hover:underline"
                            onClick={() => setActiveTab("signup")}
                        >
                            Create one now
                        </button>
                    </p>
                </form>

                {/* Sign Up Form */}
                <form
                    className={`${activeTab === "signup" ? "block" : "hidden"
                        } animate-fadeIn`}
                    onSubmit={handleSignUpSubmit}
                >
                    <h2 className="text-2xl text-[#f8fafc] mb-6 flex items-center gap-2">
                        <FaPlusCircle className="text-[#65a3e0]" />
                        Create Your Library
                    </h2>

                    <div className="mb-5 relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a0aec0]">
                            <FaUser />
                        </div>
                        <input
                            type="text"
                            className="w-full py-3 pl-12 pr-4 border border-[#2d3748] rounded-lg text-[#f1f5f9] bg-[rgba(26,32,44,0.7)] focus:border-[#65a3e0] focus:ring-2 focus:ring-[rgba(101,163,224,0.1)] outline-none transition-all"
                            placeholder="Your Name"
                            name="username"
                            value={signupData.username}
                            onChange={handleSignUpForm}
                            required
                        />
                    </div>

                    <div className="mb-5 relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a0aec0]">
                            <FaEnvelope />
                        </div>
                        <input
                            type="email"
                            className="w-full py-3 pl-12 pr-4 border border-[#2d3748] rounded-lg text-[#f1f5f9] bg-[rgba(26,32,44,0.7)] focus:border-[#65a3e0] focus:ring-2 focus:ring-[rgba(101,163,224,0.1)] outline-none transition-all"
                            placeholder="Email Address"
                            onChange={handleSignUpForm}
                            value={signupData.email}
                            name="email"
                            required
                        />
                    </div>

                    <div className="mb-5 relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a0aec0]">
                            <FaLock />
                        </div>
                        <input
                            type={showSignUpPassword ? "text" : "password"}
                            className="w-full py-3 pl-12 pr-12 border border-[#2d3748] rounded-lg text-[#f1f5f9] bg-[rgba(26,32,44,0.7)] focus:border-[#65a3e0] focus:ring-2 focus:ring-[rgba(101,163,224,0.1)] outline-none transition-all"
                            placeholder="Create Password"
                            onChange={handleSignUpForm}
                            value={signupData.password}
                            name="password"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#a0aec0]"
                            onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        >
                            {showSignUpPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isSignUpLoading}
                        className={`w-full py-3 bg-gradient-to-r from-[#3a7bd5] to-[#65a3e0] text-white rounded-lg font-semibold shadow-lg hover:from-[#2a5faf] hover:to-[#3a7bd5] hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${isSignUpLoading ? "opacity-75 cursor-not-allowed" : "hover:-translate-y-0.5"
                            }`}
                    >
                        {isSignUpLoading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <FaPlusCircle />
                                Create My Library
                            </>
                        )}
                    </button>

                    <p className="text-center text-[#a0aec0] text-sm mt-7">
                        Already have a library?{" "}
                        <button
                            type="button"
                            className="text-[#65a3e0] font-semibold hover:text-[#a0c5e8] hover:underline"
                            onClick={() => setActiveTab("signin")}
                        >
                            Sign in here
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default FormSection;