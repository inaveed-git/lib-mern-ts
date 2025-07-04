import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
// import { userState } from "../recoil/atoms/userAtom";
import { userState } from "../recoil/atoms/userAtom";
import { usePageTitle } from "../hook/usePageTitle";

const CreateLibraryPage: React.FC = () => {

    usePageTitle("New Library")
    const { user } = useRecoilValue(userState);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        isPublic: true,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/library`,
                formData,
                { withCredentials: true }
            );

            if (response.data.success) {
                navigate(`/dashboard?tab=library-details&libraryId=${response.data.data._id}`);
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Failed to create library. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">Create a New Library</h1>
                <p className="mt-2 text-gray-400">
                    Share your collection of books with others
                </p>
            </div>

            <div className="bg-[#1e2a3b] rounded-xl shadow-lg p-6 border border-[#2d3e50]">
                {error && (
                    <div className="bg-red-800 text-red-100 p-4 rounded-lg mb-6 flex items-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                            Library Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#0f172a] text-white"
                            placeholder="My Awesome Library"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#0f172a] text-white"
                            placeholder="Tell us about your library..."
                        ></textarea>
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="isPublic"
                                name="isPublic"
                                type="checkbox"
                                checked={formData.isPublic}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-[#0f172a]"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="isPublic" className="font-medium text-gray-300">
                                Public Library
                            </label>
                            <p className="text-gray-500">
                                Make this library visible to all users. Uncheck to keep it private.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 border border-gray-700 text-sm font-medium rounded-md text-white bg-[#0f172a] hover:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${loading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                }`}
                        >
                            {loading ? "Creating..." : "Create Library"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateLibraryPage;