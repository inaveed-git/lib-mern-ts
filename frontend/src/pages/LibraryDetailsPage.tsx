import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/userAtom";
import { FaShare, FaCheck } from "react-icons/fa";
import { usePageTitle } from "../hook/usePageTitle";

interface Book {
    _id: string;
    title: string;
    author: string;
    genre: string;
    publishedYear: number;
    publisher: string;
    coverImage: string;
    bookFile: string;
    isPublic: boolean;
}

interface Library {
    _id: string;
    name: string;
    description: string;
    isPublic: boolean;
    admin: {
        _id: string;
        username: string;
    };
    books: Book[];
    createdAt: string;
    updatedAt: string;
}

const LibraryDetailsPage: React.FC = () => {

    usePageTitle("Library")

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const libraryId = queryParams.get("libraryId");

    const { user } = useRecoilValue(userState);
    const [library, setLibrary] = useState<Library | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [copiedItemId, setCopiedItemId] = useState<string | null>(null);

    useEffect(() => {
        const fetchLibraryDetails = async () => {
            if (!libraryId) {
                setError("Library ID is missing");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/library/${libraryId}`,
                    { withCredentials: true }
                );

                if (response.data.success) {
                    const libData = response.data.data;
                    setLibrary(libData);

                    setIsAdmin(
                        user?._id === libData.admin?._id?.toString() ||
                        user?._id === libData.admin?.toString()
                    );
                }
            } catch (err: any) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load library details. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLibraryDetails();
    }, [libraryId, user]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleShareLibrary = () => {
        if (!library) return;

        const libraryUrl = `${window.location.origin}/library/${library._id}`;

        navigator.clipboard.writeText(libraryUrl)
            .then(() => {
                setCopiedItemId(`library-${library._id}`);
                setTimeout(() => setCopiedItemId(null), 3000);
            })
            .catch(err => {
                console.error('Failed to copy library link: ', err);
                setError("Failed to copy library link to clipboard");
            });
    };

    const handleShareBook = (bookId: string, downloadUrl: string) => {
        navigator.clipboard.writeText(downloadUrl)
            .then(() => {
                setCopiedItemId(`book-${bookId}`);
                setTimeout(() => setCopiedItemId(null), 3000);
            })
            .catch(err => {
                console.error('Failed to copy download link: ', err);
                setError("Failed to copy download link to clipboard");
            });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-red-800/70 text-red-100 p-4 rounded-lg flex items-center">
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
            </div>
        );
    }

    if (!library) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center py-12">
                    <div className="bg-gray-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="h-16 w-16 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            ></path>
                        </svg>
                    </div>
                    <h3 className="mt-4 text-xl font-medium text-white">Library not found</h3>
                    <p className="mt-2 text-gray-400 max-w-md mx-auto">
                        The library you're looking for doesn't exist or may have been removed.
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/dashboard?tab=my-libraries"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                        >
                            Back to My Libraries
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-[#1e2a3b] rounded-xl shadow-lg p-6 mb-8 border border-[#2d3e50]">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                {library.name}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`px-3 py-1 text-sm font-medium rounded-full ${library.isPublic
                                        ? "bg-green-900/50 text-green-200"
                                        : "bg-blue-900/50 text-blue-200"
                                        }`}
                                >
                                    {library.isPublic ? "Public Library" : "Private Library"}
                                </span>

                                <div className="relative">
                                    <button
                                        onClick={handleShareLibrary}
                                        className="text-gray-400 hover:text-gray-300"
                                        title="Share library link"
                                    >
                                        {copiedItemId === `library-${library._id}` ? (
                                            <FaCheck className="h-4 w-4 text-green-400" />
                                        ) : (
                                            <FaShare className="h-4 w-4" />
                                        )}
                                    </button>

                                    {copiedItemId === `library-${library._id}` && (
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                            Link copied!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-300 mb-6">
                            {library.description || "No description available"}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2 text-blue-400"
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
                                <span>Admin: {library.admin.username}</span>
                            </div>

                            <div className="flex items-center text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2 text-blue-400"
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
                                <span>{library.books.length} books</span>
                            </div>

                            <div className="flex items-center text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2 text-blue-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <span>Created: {formatDate(library.createdAt)}</span>
                            </div>

                            <div className="flex items-center text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2 text-blue-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                <span>Updated: {formatDate(library.updatedAt)}</span>
                            </div>
                        </div>
                    </div>

                    {isAdmin && (
                        <Link
                            to={`/dashboard?tab=add-books&libraryId=${libraryId}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            Add Books
                        </Link>
                    )}
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        Books in this Library
                    </h2>
                    {library.books.length > 0 && (
                        <span className="text-sm text-gray-400">
                            Showing {library.books.length} book{library.books.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {library.books.length === 0 ? (
                    <div className="bg-[#1e2a3b] rounded-xl shadow-lg p-12 text-center border border-[#2d3e50]">
                        <div className="mx-auto w-24 h-24 rounded-full bg-[#0f172a] flex items-center justify-center mb-6">
                            <svg
                                className="h-16 w-16 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                ></path>
                            </svg>
                        </div>
                        <h3 className="mt-4 text-xl font-medium text-white">No books yet</h3>
                        <p className="mt-2 text-gray-400 max-w-md mx-auto">
                            This library doesn't have any books added yet.
                            {isAdmin ? " Start by adding some books to your collection." : " Check back later."}
                        </p>
                        {isAdmin && (
                            <div className="mt-6">
                                <Link
                                    to={`/dashboard?tab=add-books&libraryId=${libraryId}`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Add Books to Library
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {library.books.map((book) => (
                            <div
                                key={book._id}
                                className="bg-[#1e2a3b] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-[#2d3e50] group"
                            >
                                <div className="p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={book.coverImage}
                                                alt={`Cover of ${book.title}`}
                                                className="h-40 w-28 object-cover rounded shadow border border-[#3a506b]"
                                            />
                                        </div>
                                        <div className="ml-4 flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                                                {book.title}
                                            </h3>
                                            <p className="text-gray-400 truncate">{book.author}</p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className="bg-blue-900/50 text-blue-100 text-xs px-2.5 py-0.5 rounded">
                                                    {book.genre}
                                                </span>
                                                <span className="text-xs bg-gray-700 text-gray-300 px-2.5 py-0.5 rounded">
                                                    a {book.publishedYear}
                                                </span>
                                                {!book.isPublic && (
                                                    <span className="text-xs bg-amber-900/50 text-amber-100 px-2.5 py-0.5 rounded">
                                                        Private
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-sm mt-2 truncate">
                                                {book.publisher}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center cursor-pointer ">
                                        <a
                                            href={`${import.meta.env.VITE_API_URL}/api/v1/book/download/${book._id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 font-medium flex items-center text-sm"
                                        >
                                            {/* ... download icon */}
                                            Download
                                            {/* {`${book.bookFile}`} */}
                                        </a>

                                        <div className="relative">
                                            <button
                                                onClick={() => handleShareBook(book._id, book.bookFile)}
                                                className="text-gray-400 hover:text-gray-300 flex items-center"
                                                title="Share download link"
                                            >
                                                {copiedItemId === `book-${book._id}` ? (
                                                    <FaCheck className="h-4 w-4 text-green-400" />
                                                ) : (
                                                    <FaShare className="h-4 w-4" />
                                                )}
                                            </button>

                                            {copiedItemId === `book-${book._id}` && (
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                    Download link copied!
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="border-t border-[#2d3e50] pt-6 mt-8">
                <Link
                    to="/dashboard?tab=my-libraries"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
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
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back to My Libraries
                </Link>
            </div>
        </div>
    );
};

export default LibraryDetailsPage;