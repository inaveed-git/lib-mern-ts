import React, { useState } from "react";

const FormSection = ({ activeTab, setActiveTab }) => {
    const [showSignInPassword, setShowSignInPassword] = useState(false);
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);

    const handleSignInSubmit = (e) => {
        e.preventDefault();
        alert(
            "Accessing your digital library... This would redirect to your library dashboard in a real application."
        );
    };

    const handleSignUpSubmit = (e) => {
        e.preventDefault();
        alert(
            "Creating your personal digital library... This would create your library in a real application."
        );
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
                    <h2 className="text-2xl text-[#f8fafc] mb-6">Access Your Library</h2>

                    <div className="mb-5 relative">
                        <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a0aec0]"></i>
                        <input
                            type="email"
                            className="w-full py-3 pl-12 pr-4 border border-[#2d3748] rounded-lg text-[#f1f5f9] bg-[rgba(26,32,44,0.7)] focus:border-[#65a3e0] focus:ring-2 focus:ring-[rgba(101,163,224,0.1)] outline-none transition-all"
                            placeholder="Email Address"
                            required
                        />
                    </div>

                    <div className="mb-5 relative">
                        <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a0aec0]"></i>
                        <input
                            type={showSignInPassword ? "text" : "password"}
                            className="w-full py-3 pl-12 pr-12 border border-[#2d3748] rounded-lg text-[#f1f5f9] bg-[rgba(26,32,44,0.7)] focus:border-[#65a3e0] focus:ring-2 focus:ring-[rgba(101,163,224,0.1)] outline-none transition-all"
                            placeholder="Password"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#a0aec0]"
                            onClick={() => setShowSignInPassword(!showSignInPassword)}
                        >
                            <i
                                className={`fas ${showSignInPassword ? "fa-eye-slash" : "fa-eye"
                                    }`}
                            ></i>
                        </button>
                    </div>

                    <div className="flex justify-between items-center mb-6 text-sm">
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="mr-2 accent-[#65a3e0]" />
                            Remember me
                        </label>
                        <a
                            href="#"
                            className="text-[#65a3e0] hover:text-[#a0c5e8] hover:underline transition-colors"
                        >
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-[#3a7bd5] to-[#65a3e0] text-white rounded-lg font-semibold shadow-lg hover:from-[#2a5faf] hover:to-[#3a7bd5] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Access My Library
                    </button>

                    <div className="relative my-6">
                        <div className="absolute top-1/2 left-0 w-[30%] h-px bg-[#2d3748]"></div>
                        <p className="text-center text-[#a0aec0] mb-4">Or sign in with</p>
                        <div className="absolute top-1/2 right-0 w-[30%] h-px bg-[#2d3748]"></div>
                    </div>

                    <div className="flex justify-center gap-4 mb-6">
                        {[
                            { provider: "google", color: "#dd4b39", icon: "fa-google" },
                            { provider: "github", color: "#333333", icon: "fa-github" },
                            { provider: "microsoft", color: "#0078d7", icon: "fa-microsoft" },
                        ].map((social) => (
                            <a
                                key={social.provider}
                                href="#"
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:-translate-y-0.5"
                                style={{ backgroundColor: social.color }}
                            >
                                <i className={`fab ${social.icon}`}></i>
                            </a>
                        ))}
                    </div>

                    <p className="text-center text-[#a0aec0] text-sm">
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
                    <h2 className="text-2xl text-[#f8fafc] mb-6">Create Your Library</h2>

                    <div className="mb-5 relative">
                        <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a0aec0]"></i>
                        <input
                            type="text"
                            className="w-full py-3 pl-12 pr-4 border border-[#2d3748] rounded-lg text-[#f1f5f9] bg-[rgba(26,32,44,0.7)] focus:border-[#65a3e0] focus:ring-2 focus:ring-[rgba(101,163,224,0.1)] outline-none transition-all"
                            placeholder="Your Name"
                            required
                        />
                    </div>

                    <div className="mb-5 relative">
                        <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a0aec0]"></i>
                        <input
                            type="email"
                            className="w-full py-3 pl-12 pr-4 border border-[#2d3748] rounded-lg text-[#f1f5f9] bg-[rgba(26,32,44,0.7)] focus:border-[#65a3e0] focus:ring-2 focus:ring-[rgba(101,163,224,0.1)] outline-none transition-all"
                            placeholder="Email Address"
                            required
                        />
                    </div>

                    <div className="mb-5 relative">
                        <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a0aec0]"></i>
                        <input
                            type={showSignUpPassword ? "text" : "password"}
                            className="w-full py-3 pl-12 pr-12 border border-[#2d3748] rounded-lg text-[#f1f5f9] bg-[rgba(26,32,44,0.7)] focus:border-[#65a3e0] focus:ring-2 focus:ring-[rgba(101,163,224,0.1)] outline-none transition-all"
                            placeholder="Create Password"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#a0aec0]"
                            onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        >
                            <i
                                className={`fas ${showSignUpPassword ? "fa-eye-slash" : "fa-eye"
                                    }`}
                            ></i>
                        </button>
                    </div>





                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-[#3a7bd5] to-[#65a3e0] text-white rounded-lg font-semibold shadow-lg hover:from-[#2a5faf] hover:to-[#3a7bd5] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Create My Library
                    </button>

                    <div className="relative my-6">
                        <div className="absolute top-1/2 left-0 w-[30%] h-px bg-[#2d3748]"></div>
                        <p className="text-center text-[#a0aec0] mb-4">Or create with</p>
                        <div className="absolute top-1/2 right-0 w-[30%] h-px bg-[#2d3748]"></div>
                    </div>

                    <div className="flex justify-center gap-4 mb-6">
                        {[
                            { provider: "google", color: "#dd4b39", icon: "fa-google" },
                            { provider: "github", color: "#333333", icon: "fa-github" },
                            { provider: "microsoft", color: "#0078d7", icon: "fa-microsoft" },
                        ].map((social) => (
                            <a
                                key={social.provider}
                                href="#"
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:-translate-y-0.5"
                                style={{ backgroundColor: social.color }}
                            >
                                <i className={`fab ${social.icon}`}></i>
                            </a>
                        ))}
                    </div>

                    <p className="text-center text-[#a0aec0] text-sm">
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
