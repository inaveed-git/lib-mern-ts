import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/userAtom";
import { FaShare, FaCheck } from "react-icons/fa";

interface Library {
    _id: string;
    name: string;
}

interface Book {
    _id: string;
    title: string;
    author: string;
    genre: string;
    publishedYear: number;
    publisher: string;
    coverImage: string;
    bookFile: string;
    libraries: Library[];
    isPublic?: boolean;
}

const BookList: React.FC = () => {
    const { user } = useRecoilValue(userState);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copiedBookId, setCopiedBookId] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/book/my-books`,
                    { withCredentials: true }
                );

                if (response.data.success) {
                    setBooks(Array.isArray(response.data.data)
                        ? response.data.data
                        : []);
                }
            } catch (err: any) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load your books. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Handle share button click - copy download link
    const handleShareClick = (bookId: string, downloadUrl: string) => {
        // Copy download URL to clipboard
        navigator.clipboard.writeText(downloadUrl)
            .then(() => {
                setCopiedBookId(bookId);
                setTimeout(() => setCopiedBookId(null), 3000);
            })
            .catch(err => {
                console.error('Failed to copy download link: ', err);
                setError("Failed to copy download link to clipboard");
            });
    };

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
                    <h1 className="text-3xl font-bold text-white mb-2">Your Books</h1>
                    <p className="text-gray-400">
                        All books in your collection
                    </p>
                </div>
                <Link
                    to="/dashboard?tab=create-book"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                    Add New Book
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

            {books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <div
                            key={book._id}
                            className="bg-[#1e2a3b] rounded-xl shadow-lg overflow-hidden border border-[#2d3e50] transition-transform duration-300 hover:scale-[1.02]"
                        >
                            <div className="p-5">
                                <div className="flex">
                                    <img
                                        src={book.coverImage}
                                        alt={`Cover of ${book.title}`}
                                        className="w-20 h-28 object-cover rounded-lg shadow-lg border border-gray-700"
                                    />
                                    <div className="ml-4 flex-1 min-w-0">
                                        <h2 className="text-lg font-bold text-white truncate">
                                            {book.title}
                                        </h2>
                                        <p className="text-gray-400 text-sm truncate">
                                            {book.author}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <span className="bg-blue-900/50 text-blue-200 text-xs px-2.5 py-0.5 rounded">
                                                {book.genre}
                                            </span>
                                            <span className="ml-2 text-sm text-gray-400">
                                                {book.publishedYear}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1 truncate">
                                            {book.publisher}
                                        </p>
                                    </div>
                                </div>

                                {book.libraries && book.libraries.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-400 mb-1">In libraries:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {book.libraries.slice(0, 3).map(lib => (
                                                <Link
                                                    key={lib._id}
                                                    to={`/dashboard?tab=library-details&libraryId=${lib._id}`}
                                                    className="text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded hover:bg-blue-800 transition-colors duration-200"
                                                >
                                                    {lib.name}
                                                </Link>
                                            ))}
                                            {book.libraries.length > 3 && (
                                                <span className="text-xs text-gray-400">
                                                    +{book.libraries.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 flex justify-between items-center">
                                    <a
                                        href={book.bookFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
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
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                            />
                                        </svg>
                                        Download
                                    </a>

                                    {/* Share Button */}
                                    <div className="relative">
                                        <button
                                            onClick={() => handleShareClick(book._id, book.bookFile)}
                                            className="text-gray-400 hover:text-gray-300 text-sm font-medium flex items-center"
                                            title="Share download link"
                                        >
                                            {copiedBookId === book._id ? (
                                                <FaCheck className="h-4 w-4 text-green-400" />
                                            ) : (
                                                <FaShare className="h-4 w-4" />
                                            )}
                                        </button>

                                        {/* Copy confirmation message */}
                                        {copiedBookId === book._id && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                Download link copied!
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Book visibility status */}
                                {book.isPublic === false && (
                                    <div className="mt-3 bg-yellow-900/30 text-yellow-400 text-xs px-3 py-1.5 rounded-lg flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3 mr-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        This book is private
                                    </div>
                                )}
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
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-xl font-medium text-white">No books found</h3>
                    <p className="mt-2 text-gray-400 max-w-md mx-auto">
                        You haven't added any books to your collection yet. Start by adding your first book.
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/dashboard?tab=create-book"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                        >
                            Add Your First Book
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookList;