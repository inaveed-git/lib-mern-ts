import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
    FaBook,
    FaUser,
    FaTag,
    FaCalendarAlt,
    FaBuilding,
    FaImage,
    FaFilePdf,
    FaPlus,
    FaLock,
    FaLockOpen
} from "react-icons/fa";

interface tForm {
    title: string;
    author: string;
    genre: string;
    publishedYear: number | string;
    publisher: string;
    coverImage: File | null;
    bookFile: File | null;
    libraries: string[];
    isPublic: boolean;
}

interface Library {
    _id: string;
    name: string;
}

const AddBookForm: React.FC = () => {
    // ... existing state and refs ...

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center gap-3">
                <FaBook className="text-blue-500" />
                Add New Book
            </h2>

            {/* ... error/success messages ... */}

            <form onSubmit={handleSubmit} className="space-y-6 text-black">
                {/* Title Field */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <FaBook />
                    </div>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Book Title"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Author Field */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <FaUser />
                    </div>
                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Author"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Genre Field */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <FaTag />
                    </div>
                    <input
                        type="text"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        placeholder="Genre"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Published Year */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <FaCalendarAlt />
                        </div>
                        <input
                            type="number"
                            name="publishedYear"
                            value={formData.publishedYear}
                            onChange={handleChange}
                            placeholder="Published Year"
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Publisher */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <FaBuilding />
                        </div>
                        <input
                            type="text"
                            name="publisher"
                            value={formData.publisher}
                            onChange={handleChange}
                            placeholder="Publisher"
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FaImage className="text-blue-500" />
                            Cover Image
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {formData.coverImage ? (
                                        <span className="text-sm text-gray-500">
                                            {formData.coverImage.name}
                                        </span>
                                    ) : (
                                        <>
                                            <FaImage className="w-8 h-8 mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, JPEG (MAX. 5MB)
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={coverImageRef}
                                    type="file"
                                    name="coverImage"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Book File */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FaFilePdf className="text-red-500" />
                            Book File (PDF)
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {formData.bookFile ? (
                                        <span className="text-sm text-gray-500">
                                            {formData.bookFile.name}
                                        </span>
                                    ) : (
                                        <>
                                            <FaFilePdf className="w-8 h-8 mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PDF only (MAX. 20MB)
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    name="bookFile"
                                    onChange={handleChange}
                                    accept=".pdf"
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Library Selection */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaPlus className="text-green-500" />
                        Add to Libraries
                    </label>

                    {/* ... library checkboxes ... */}
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {formData.isPublic ? (
                        <FaLockOpen className="text-green-500 text-xl" />
                    ) : (
                        <FaLock className="text-gray-500 text-xl" />
                    )}
                    <div>
                        <input
                            type="checkbox"
                            id="isPublic"
                            name="isPublic"
                            checked={formData.isPublic}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label
                            htmlFor="isPublic"
                            className="ml-2 text-sm text-gray-700"
                        >
                            Make this book public
                        </label>
                    </div>
                </div>

                {/* Progress Bar */}
                {progress > 0 && (
                    <div className="pt-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold inline-block text-blue-600">
                                Uploading... {progress}%
                            </span>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                            <div
                                style={{ width: `${progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            ></div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                >
                    <FaPlus />
                    Add Book
                </button>
            </form>
        </div>
    );
};

export default AddBookForm;