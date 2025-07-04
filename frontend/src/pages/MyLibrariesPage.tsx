import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/userAtom";
import { usePageTitle } from "../hook/usePageTitle";

interface Book {
    _id: string;
    title: string;
    coverImage: string;
}

interface Library {
    _id: string;
    name: string;
    description: string;
    isPublic: boolean;
    books: Book[];
    admin: {
        _id: string;
        username: string;
    };
}

const MyLibrariesPage: React.FC = () => {
    usePageTitle("My Library's")

    const { user } = useRecoilValue(userState);
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLibraries = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/library/my-libraries`,
                    { withCredentials: true }
                );

                if (response.data.success) {
                    // Ensure we're getting an array of libraries
                    setLibraries(Array.isArray(response.data.data)
                        ? response.data.data
                        : []);
                }
            } catch (err: any) {
                setError(
                    err.response?.data?.message || "Failed to load your libraries. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLibraries();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Libraries</h1>
                    <p className="text-gray-300">
                        Manage your personal book collections
                    </p>
                </div>
                <Link
                    to="/dashboard?tab=create-library"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                    Create New Library
                </Link>
            </div>

            {error && (
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
            )}

            {libraries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {libraries.map((library) => (
                        <div
                            key={library._id}
                            className="bg-[#1e2a3b] rounded-xl shadow-lg overflow-hidden border border-[#2d3e50] transition-transform duration-300 hover:scale-[1.02]"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-xl font-bold text-white mb-2 truncate">
                                            <Link
                                                to={`/dashboard?tab=library-details&libraryId=${library._id}`}
                                                className="hover:text-blue-400 transition-colors duration-200"
                                            >
                                                {library.name}
                                            </Link>
                                        </h2>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {library.description || "No description provided"}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${library.isPublic
                                            ? "bg-green-900/50 text-green-200"
                                            : "bg-blue-900/50 text-blue-200"
                                            }`}
                                    >
                                        {library.isPublic ? "Public" : "Private"}
                                    </span>
                                </div>

                                <div className="flex items-center text-sm text-gray-400 mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1 flex-shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                    <span className="truncate">
                                        {library.books?.length || 0} book{library.books?.length === 1 ? "" : "s"}
                                    </span>
                                </div>

                                {library.books && library.books.length > 0 ? (
                                    <div className="flex -space-x-2">
                                        {library.books.slice(0, 5).map((book) => (
                                            <div key={book._id} className="relative group">
                                                <img
                                                    src={book.coverImage}
                                                    alt={`Cover of ${book.title}`}
                                                    className="w-10 h-14 rounded shadow border-2 border-[#1e2a3b] object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded flex items-center justify-center">
                                                    <span className="text-xs text-white font-medium text-center px-1 truncate">
                                                        {book.title}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {library.books.length > 5 && (
                                            <div className="w-10 h-14 bg-gray-700 rounded shadow border-2 border-[#1e2a3b] flex items-center justify-center text-xs font-bold text-gray-400">
                                                +{library.books.length - 5}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                                        <p className="text-gray-400 text-sm">No books added yet</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-[#2d3e50] px-6 py-4 border-t border-[#3a506b] flex justify-end">
                                <Link
                                    to={`/dashboard?tab=library-details&libraryId=${library._id}`}
                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 flex items-center"
                                >
                                    View Details
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 ml-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 rounded-full bg-[#1e2a3b] flex items-center justify-center mb-6">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-xl font-medium text-white">No libraries created yet</h3>
                    <p className="mt-2 text-gray-400 max-w-md mx-auto">
                        You haven't created any libraries. Start by creating your first collection to organize your books.
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/dashboard?tab=create-library"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                        >
                            Create Your First Library
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyLibrariesPage;