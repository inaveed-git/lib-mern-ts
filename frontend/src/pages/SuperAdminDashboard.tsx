import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/atoms/userAtom';
import { FaTrash, FaUser, FaBook, FaLink } from 'react-icons/fa';
import { IoIosRefreshCircle } from 'react-icons/io';
import { IoCloseCircleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";



interface User {
    _id: string;
    username: string;
    email: string;
    isSuperAdmin: boolean;
    createdAt: string;
}

interface Book {
    _id: string;
    title: string;
    author: string;
    userId: {
        _id: string;
        username: string;
    };
    createdAt: string;
}

const SuperAdminDashboard = () => {
    const { user: reqUser } = useRecoilValue(userState);
    const [users, setUsers] = useState<User[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [deletingBookId, setDeletingBookId] = useState<string | null>(null);

    useEffect(() => {
        if (!reqUser || !reqUser.isSuperAdmin) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const usersResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/user/`,
                    { withCredentials: true }
                );

                const booksResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/user/books/all`,
                    { withCredentials: true }
                );

                if (usersResponse.data.success) {
                    setUsers(usersResponse.data.data);
                }

                if (booksResponse.data.success) {
                    setBooks(booksResponse.data.data);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [reqUser]);

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user and all their data?')) return;

        try {
            setDeletingUserId(userId);
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/v1/user/${userId}`,
                { withCredentials: true }
            );

            setUsers(users.filter(user => user._id !== userId));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeletingUserId(null);
        }
    };

    const handleDeleteBook = async (bookId: string) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;

        try {
            setDeletingBookId(bookId);
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/v1/user/books/${bookId}`,
                { withCredentials: true }
            );

            setBooks(books.filter(book => book._id !== bookId));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete book');
        } finally {
            setDeletingBookId(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!reqUser || !reqUser.isSuperAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] to-[#2d5182] flex items-center justify-center p-4">
                <div className="bg-[rgba(26,32,44,0.9)] rounded-xl p-6 border-l-4 border-[#65a3e0] backdrop-blur-md max-w-md w-full">
                    <div className="bg-red-800/70 text-red-100 p-4 rounded-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        You don't have permission to access this page
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] to-[#2d5182] flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#65a3e0]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] to-[#2d5182] flex items-center justify-center p-4">
                <div className="bg-[rgba(26,32,44,0.9)] rounded-xl p-6 border-l-4 border-[#f87171] backdrop-blur-md max-w-md w-full">
                    <div className="bg-red-800/70 text-red-100 p-4 rounded-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] to-[#2d5182] p-4 md:p-8">

            <div className="max-w-7xl mx-auto">



                <div className="relative bg-[rgba(26,32,44,0.8)] rounded-xl shadow-lg p-6 border border-[#2d3e50] backdrop-blur-md mb-8">
                    <div className='flex justify-between'>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                            <FaLink className="text-[#65a3e0] mr-3" />
                            Super Admin Dashboard
                        </h1>

                        <Link to="/dashboard?tab=AdminDash"> <span className="text-blue-400 text-3xl"> <IoCloseCircleSharp /> </span></Link>

                    </div>
                    <p className="text-[#a0aec0] mb-6">
                        Manage all users and books in the system. Organize, monitor and control access to resources.
                    </p>

                    <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                        <Tab.List className="flex space-x-1 rounded-xl bg-[#1e2a3b] p-1 mb-6 border border-[#2d3e50]">
                            <Tab className={({ selected }) =>
                                `w-full rounded-lg py-3 text-sm font-medium leading-5 flex items-center justify-center
                                ${selected
                                    ? 'bg-[#65a3e0] text-white shadow'
                                    : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
                                }`
                            }>
                                <FaUser className="mr-2" />
                                User Management
                            </Tab>
                            <Tab className={({ selected }) =>
                                `w-full rounded-lg py-3 text-sm font-medium leading-5 flex items-center justify-center
                                ${selected
                                    ? 'bg-[#65a3e0] text-white shadow'
                                    : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
                                }`
                            }>
                                <FaBook className="mr-2" />
                                Book Management
                            </Tab>
                        </Tab.List>

                        <Tab.Panels>
                            <Tab.Panel>
                                <div className="bg-[#1e2a3b] rounded-xl shadow-lg p-5 border border-[#2d3e50]">
                                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                        <FaUser className="text-[#65a3e0] mr-2" />
                                        All Users
                                    </h2>

                                    <div className="overflow-x-auto rounded-lg border border-[#2d3e50]">
                                        <table className="min-w-full">
                                            <thead className="bg-[#0f172a]">
                                                <tr>
                                                    <th className="py-3 px-4 text-left text-[#a0aec0]">Username</th>
                                                    <th className="py-3 px-4 text-left text-[#a0aec0]">Email</th>
                                                    <th className="py-3 px-4 text-left text-[#a0aec0]">Role</th>
                                                    <th className="py-3 px-4 text-left text-[#a0aec0]">Joined</th>
                                                    <th className="py-3 px-4 text-left text-[#a0aec0]">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((user) => (
                                                    <tr
                                                        key={user._id}
                                                        className="border-b border-[#2d3e50] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200"
                                                    >
                                                        <td className="py-3 px-4 text-white">{user.username}</td>
                                                        <td className="py-3 px-4 text-[#a0aec0]">{user.email}</td>
                                                        <td className="py-3 px-4">
                                                            <span className={`px-3 py-1 rounded-full text-xs ${user.isSuperAdmin
                                                                ? 'bg-[#a78bfa]/20 text-[#a78bfa]'
                                                                : 'bg-[#65a3e0]/20 text-[#65a3e0]'
                                                                }`}>
                                                                {user.isSuperAdmin ? 'Super Admin' : 'User'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-[#a0aec0]">{formatDate(user.createdAt)}</td>
                                                        <td className="py-3 px-4">
                                                            <button
                                                                onClick={() => handleDeleteUser(user._id)}
                                                                disabled={user._id === reqUser?._id || deletingUserId === user._id}
                                                                className={`p-2 rounded-full ${user._id === reqUser?._id || deletingUserId === user._id
                                                                    ? 'opacity-50 cursor-not-allowed text-gray-500'
                                                                    : 'text-[#f87171] hover:bg-[#f87171]/20'
                                                                    }`}
                                                                title={user._id === reqUser?._id ? "Cannot delete your own account" : "Delete user and all associated data"}
                                                            >
                                                                {deletingUserId === user._id ? (
                                                                    <IoIosRefreshCircle className="animate-spin text-xl" />
                                                                ) : (
                                                                    <FaTrash />
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {users.length === 0 && (
                                        <div className="text-center py-8 text-[#a0aec0]">
                                            No users found
                                        </div>
                                    )}
                                </div>
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="bg-[#1e2a3b] rounded-xl shadow-lg p-5 border border-[#2d3e50]">
                                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                        <FaBook className="text-[#65a3e0] mr-2" />
                                        All Books
                                    </h2>

                                    <div className="overflow-x-auto rounded-lg border border-[#2d3e50]">
                                        <table className="min-w-full">
                                            <thead className="bg-[#0f172a]">
                                                <tr>
                                                    <th className="py-3 px-4 text-left text-[#a0aec0]">Title</th>
                                                    <th className="py-3 px-4 text-left text-[#a0aec0]">Author</th>
                                                    <th className="py-3 px-4 text-left text-[#a0aec0]">Owner</th>
                                                    <th className="py-3 px-4 text-left text-[#a0aec0]">Created</th>
                                                    <th className="py-3 px-4 text-left text-[#a0aec0]">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {books.map((book) => (
                                                    <tr
                                                        key={book._id}
                                                        className="border-b border-[#2d3e50] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200"
                                                    >
                                                        <td className="py-3 px-4 text-white max-w-xs truncate">{book.title}</td>
                                                        <td className="py-3 px-4 text-[#a0aec0]">{book.author}</td>
                                                        <td className="py-3 px-4 text-[#a0aec0]">
                                                            {book.userId?.username || 'Unknown'}
                                                        </td>
                                                        <td className="py-3 px-4 text-[#a0aec0]">{formatDate(book.createdAt)}</td>
                                                        <td className="py-3 px-4">
                                                            <button
                                                                onClick={() => handleDeleteBook(book._id)}
                                                                className={`p-2 rounded-full ${deletingBookId === book._id
                                                                    ? 'opacity-50 cursor-not-allowed text-gray-500'
                                                                    : 'text-[#f87171] hover:bg-[#f87171]/20'
                                                                    }`}
                                                                title="Delete book"
                                                                disabled={deletingBookId === book._id}
                                                            >
                                                                {deletingBookId === book._id ? (
                                                                    <IoIosRefreshCircle className="animate-spin text-xl" />
                                                                ) : (
                                                                    <FaTrash />
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {books.length === 0 && (
                                        <div className="text-center py-8 text-[#a0aec0]">
                                            No books found
                                        </div>
                                    )}
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[rgba(26,32,44,0.8)] rounded-xl p-5 border-l-4 border-[#65a3e0] backdrop-blur-md">
                        <h3 className="mb-3 flex items-center text-lg font-semibold text-white">
                            <FaUser className="text-[#65a3e0] mr-2" />
                            User Statistics
                        </h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#a0aec0]">Total Users</p>
                                <p className="text-2xl font-bold text-white">{users.length}</p>
                            </div>
                            <div>
                                <p className="text-[#a0aec0]">Super Admins</p>
                                <p className="text-2xl font-bold text-[#a78bfa]">
                                    {users.filter(u => u.isSuperAdmin).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[rgba(26,32,44,0.8)] rounded-xl p-5 border-l-4 border-[#4ade80] backdrop-blur-md">
                        <h3 className="mb-3 flex items-center text-lg font-semibold text-white">
                            <FaBook className="text-[#4ade80] mr-2" />
                            Book Statistics
                        </h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#a0aec0]">Total Books</p>
                                <p className="text-2xl font-bold text-white">{books.length}</p>
                            </div>
                            <div>
                                <p className="text-[#a0aec0]">Unique Authors</p>
                                <p className="text-2xl font-bold text-[#4ade80]">
                                    {new Set(books.map(b => b.author)).size}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;