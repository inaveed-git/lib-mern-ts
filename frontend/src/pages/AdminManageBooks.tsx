import React, { useEffect, useState } from "react";
import axios from "axios";

interface Book {
    _id: string;
    title: string;
    author: string;
    genre: string;
    publishedYear: number;
    publisher: string;
    coverImage?: string;
    bookFile?: string;
}

const AdminManageBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/book/my-books`, { withCredentials: true });
            setBooks(res.data.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to load books");
        } finally {
            setLoading(false);
        }
    };

    const deleteBook = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;

        try {
            await axios.delete(`/api/book/${id}`, { withCredentials: true });
            setBooks((prev) => prev.filter((book) => book._id !== id));
        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to delete book");
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {books.map((book) => (
                <div key={book._id} className="border rounded shadow p-4 flex flex-col">
                    {book.coverImage && (
                        <img src={book.coverImage} alt={book.title} className="w-full h-48 object-cover rounded" />
                    )}
                    <h3 className="font-semibold mt-2">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <p className="text-xs text-gray-500">{book.genre}</p>
                    <p className="text-xs text-gray-500">{book.publishedYear}</p>

                    <div className="mt-auto flex justify-between items-center">
                        {book.bookFile && (
                            <a
                                href={book.bookFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="text-blue-600 hover:underline"
                            >
                                Download
                            </a>
                        )}

                        <button
                            onClick={() => deleteBook(book._id)}
                            className="text-red-600 hover:underline"
                        >
                            Delete
                        </button>

                        <button
                            onClick={() => {
                                // Share logic: copy URL or open share dialog
                                navigator.clipboard.writeText(window.location.origin + "/book/" + book._id);
                                alert("Book link copied to clipboard!");
                            }}
                            className="text-green-600 hover:underline"
                        >
                            Share
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminManageBooks;
