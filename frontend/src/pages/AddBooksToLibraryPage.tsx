import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/userAtom";
import { usePageTitle } from '../hook/usePageTitle';
interface Book {
    _id: string;
    title: string;
    author: string;
    coverImage: string;
    publishedYear: number;
}

interface Library {
    _id: string;
    name: string;
    books: Book[];
}

const AddBooksToLibraryPage: React.FC = () => {

    usePageTitle("New Library")

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const libraryId = queryParams.get("libraryId");
    const { user } = useRecoilValue(userState);

    const [library, setLibrary] = useState<Library | null>(null);
    const [userBooks, setUserBooks] = useState<Book[]>([]);
    const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!libraryId) {
                setError("Library ID is missing");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Fetch library details
                const libraryRes = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/library/${libraryId}`,
                    { withCredentials: true }
                );

                if (!libraryRes.data.success) {
                    throw new Error(libraryRes.data.message || "Failed to load library");
                }

                setLibrary(libraryRes.data.data);

                // Fetch user's books
                const booksRes = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/book/my-books`,
                    { withCredentials: true }
                );

                if (!booksRes.data.success) {
                    throw new Error(booksRes.data.message || "Failed to load books");
                }

                // Filter out books already in the library
                const existingBookIds = libraryRes.data.data.books.map(b => b._id);
                const availableBooks = booksRes.data.data.filter(
                    (book: Book) => !existingBookIds.includes(book._id)
                );

                setUserBooks(availableBooks);

            } catch (err: any) {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to load data. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [libraryId]);

    const handleBookSelect = (bookId: string) => {
        setSelectedBooks(prev => {
            if (prev.includes(bookId)) {
                return prev.filter(id => id !== bookId);
            } else {
                return [...prev, bookId];
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!libraryId || selectedBooks.length === 0) return;

        try {
            setSubmitting(true);
            setError("");

            // Add each selected book to the library
            const requests = selectedBooks.map(bookId =>
                axios.post(
                    `${import.meta.env.VITE_API_URL}/api/v1/library/${libraryId}/books/${bookId}`,
                    {},
                    { withCredentials: true }
                )
            );

            await Promise.all(requests);
            setSuccess(true);

            // Redirect after success
            setTimeout(() => {
                navigate(`/dashboard?tab=library-details&libraryId=${libraryId}`);
            }, 2000);

        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to add books to library. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Add Books to {library?.name || "Library"}
                </h1>
                <p className="text-gray-400">
                    Select books from your collection to add to this library
                </p>
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
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 极 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-800/70 text-green-100 p-4 rounded-lg mb-6 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Books added successfully! Redirecting to library...
                </div>
            )}

            {userBooks.length === 0 ? (
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
                    <h3 className="mt-4 text-xl font-medium text-white">No books available to add</h3>
                    <p className="mt-2 text-gray-400 max-w-md mx-auto">
                        {library?.name
                            ? `All your books are already in "${library.name}" or you haven't created any books yet.`
                            : "You haven't created any books yet."}
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-white bg-[#0f172a] hover:bg-[#1e293b]"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate("/dashboard?tab=create-book")}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Create New Book
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {userBooks.map((book) => (
                            <div
                                key={book._id}
                                className={`bg-[#1e2a3b] rounded-lg p-4 border-2 cursor-pointer transition-all duration-200 ${selectedBooks.includes(book._id)
                                    ? "border-blue-500 bg-blue-900/20"
                                    : "border-[#2d3e50] hover:border-blue-400"
                                    }`}
                                onClick={() => handleBookSelect(book._id)}
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                            checked={selectedBooks.includes(book._id)}
                                            onChange={() => handleBookSelect(book._id)}
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <div className="flex items-center">
                                            <img
                                                src={book.coverImage}
                                                alt={`Cover of ${book.title}`}
                                                className="w-12 h-16 object-cover rounded mr-3"
                                            />
                                            <div>
                                                <h3 className="text-md font-medium text-white line-clamp-1">
                                                    {book.title}
                                                </h3>
                                                <p className="text-sm text-gray-400">{book.author}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {book.publishedYear}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center border-t border-[#2d3e50] pt-6">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 border border-gray-700 text-sm font-medium rounded-md text-white bg-[#0f172a] hover:bg-[#1e293b]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={selectedBooks.length === 0 || submitting}
                            className={`px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${selectedBooks.length === 0 || submitting
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {submitting ? (
                                <span className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Adding Books...
                                </span>
                            ) : (
                                `Add ${selectedBooks.length} Book${selectedBooks.length !== 1 ? "s" : ""}`
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddBooksToLibraryPage;