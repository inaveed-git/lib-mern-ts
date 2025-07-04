// src/pages/LibrariesPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/userAtom";
import { usePageTitle } from "../hook/usePageTitle";

interface Library {
    _id: string;
    name: string;
    description: string;
    admin: {
        username: string;
    };
    books: Array<{
        coverImage: string;
    }>;
}

const LibrariesPage: React.FC = () => {

    usePageTitle("Library's")

    const [libraries, setLibraries] = useState<Library[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = useRecoilValue(userState);

    useEffect(() => {
        const fetchPublicLibraries = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/library/public`,
                    { withCredentials: true }
                );

                if (response.data.success) {
                    const librariesWithBooks = response.data.data.map((library: any) => ({
                        ...library,
                        books: library.books || []
                    }));
                    setLibraries(librariesWithBooks);
                }
            } catch (err: any) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load public libraries. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPublicLibraries();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f1a2f] to-[#1a2a3a]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1a2f] to-[#1a2a3a] text-white pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                        Welcome to ShelfLib
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Discover and share book collections from our community of readers
                    </p>
                </div>

                {error && (
                    <div className="bg-red-800/70 text-red-100 p-4 rounded-lg mb-8 flex justify-center items-center">
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

                <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-400">Public Libraries</h2>
                    <div className="text-sm text-gray-400">
                        Showing {libraries.length} libraries
                    </div>
                </div>

                {libraries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {libraries.map((library) => (
                            <div
                                key={library._id}
                                className="bg-[#1e2a3b]/70 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-[#2d3e50] transition-transform duration-300 hover:scale-[1.02] hover:border-blue-400"
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        <Link
                                            to={`/dashboard?tab=library-details&libraryId=${library._id}`}
                                            className="hover:text-blue-400 transition-colors"
                                        >
                                            {library.name}
                                        </Link>
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {library.description || "No description available"}
                                    </p>

                                    <div className="flex items-center text-sm text-gray-400 mb-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        <span>By {library.admin.username}</span>
                                    </div>

                                    {library.books && library.books.length > 0 && (
                                        <div className="flex -space-x-2">
                                            {library.books.slice(0, 5).map((book, index) => (
                                                book.coverImage ? (
                                                    <img
                                                        key={index}
                                                        src={book.coverImage}
                                                        alt="Book cover"
                                                        className="w-10 h-14 rounded shadow border-2 border-[#1e2a3b] object-cover"
                                                    />
                                                ) : (
                                                    <div
                                                        key={index}
                                                        className="w-10 h-14 bg-gray-700 rounded shadow border-2 border-[#1e2a3b] flex items-center justify-center"
                                                    >
                                                        <span className="text-xs">📚</span>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-[#2d3e50] px-6 py-4 border-t border-[#3a506b] flex justify-end">
                                    {user?.user?._id ? (
                                        <Link
                                            to={`/dashboard?tab=library-details&libraryId=${library._id}`}
                                            className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
                                        >
                                            Browse Library
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
                                    ) : (
                                        <Link
                                            to={`/login?redirect=/dashboard?tab=library-details&libraryId=${library._id}`}
                                            className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
                                        >
                                            Browse Library
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
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 rounded-full bg-[#1e2a3b] flex items-center justify-center mb-6">
                            <span className="text-4xl">📚</span>
                        </div>
                        <h3 className="mt-4 text-xl font-medium text-white">No public libraries yet</h3>
                        <p className="mt-2 text-gray-400 max-w-md mx-auto">
                            Be the first to share your library with the community
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                            >
                                Sign In to Create Library
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibrariesPage;