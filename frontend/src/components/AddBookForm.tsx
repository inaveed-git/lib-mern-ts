import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Library {
    _id: string;
    name: string;
}

interface FormData {
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

const AddBookForm: React.FC = () => {



    const [formData, setFormData] = useState<FormData>({
        title: "",
        author: "",
        genre: "",
        publishedYear: "",
        publisher: "",
        coverImage: null,
        bookFile: null,
        libraries: [],
        isPublic: false
    });

    const [libraries, setLibraries] = useState<Library[]>([]);
    const [progress, setProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loadingLibraries, setLoadingLibraries] = useState(true);

    const coverImageRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchLibraries = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/library/my-libraries`,
                    { withCredentials: true }
                );
                setLibraries(response.data.data || []);
            } catch (error) {
                console.error("Error fetching libraries:", error);
                setErrorMessage("Failed to load your libraries. You can still add the book.");
            } finally {
                setLoadingLibraries(false);
            }
        };

        fetchLibraries();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "file") {
            const file = (e.target as HTMLInputElement).files?.[0] || null;
            setFormData((prev) => ({ ...prev, [name]: file }));
        } else if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: name === "publishedYear" ? Number(value) : value,
            }));
        }
    };

    const handleLibraryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const libraryId = e.target.value;
        const isChecked = e.target.checked;

        setFormData(prev => {
            if (isChecked) {
                return {
                    ...prev,
                    libraries: [...prev.libraries, libraryId]
                };
            } else {
                return {
                    ...prev,
                    libraries: prev.libraries.filter(id => id !== libraryId)
                };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { title, author, genre, publishedYear, publisher, coverImage, bookFile } = formData;

        if (!title || !author || !genre || !publishedYear || !publisher || !coverImage || !bookFile) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        try {
            const data = new FormData();

            data.append("title", title);
            data.append("author", author);
            data.append("genre", genre);
            data.append("publishedYear", String(publishedYear));
            data.append("publisher", publisher);
            data.append("isPublic", String(formData.isPublic));


            formData.libraries.forEach(libraryId => {
                data.append("libraries", libraryId);
            });


            data.append("coverImage", coverImage);
            data.append("file", bookFile);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/book/add`,
                data,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                    onUploadProgress: (event) => {
                        const percent = Math.round(
                            (event.loaded * 100) / (event.total || 1)
                        );
                        setProgress(percent);
                    },
                }
            );

            setSuccessMessage(response.data.message || "Book added successfully!");
            setErrorMessage(null);


            setFormData({
                title: "",
                author: "",
                genre: "",
                publishedYear: "",
                publisher: "",
                coverImage: null,
                bookFile: null,
                libraries: [],
                isPublic: false
            });

            if (coverImageRef.current) coverImageRef.current.value = "";
            if (fileRef.current) fileRef.current.value = "";
        } catch (error: any) {
            setErrorMessage(
                error?.response?.data?.message ||
                error?.message ||
                "An unexpected error occurred while adding the book. Please try again."
            );
            setSuccessMessage(null);
        } finally {
            setProgress(0);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white text-black rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Add New Book</h2>

            {errorMessage && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Book Title"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Author <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Author Name"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Genre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Fiction, Science, etc."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Published Year <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="publishedYear"
                            value={formData.publishedYear}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="2023"
                            min="1000"
                            max={new Date().getFullYear()}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Publisher <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Publisher Name"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Cover Image <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 极 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <p className={`text-sm ${formData.coverImage ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                                        {formData.coverImage
                                            ? formData.coverImage.name
                                            : "Click to upload cover image"}
                                    </p>
                                    {formData.coverImage && (
                                        <p className="text-xs text-gray-500 mt-1">Click to change</p>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    name="coverImage"
                                    ref={coverImageRef}
                                    onChange={handleChange}
                                    accept="image/*"
                                    className="hidden"
                                    required
                                />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Book File (PDF) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                    </svg>
                                    <p className={`text-sm ${formData.bookFile ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                                        {formData.bookFile
                                            ? formData.bookFile.name
                                            : "Click to upload PDF file"}
                                    </p>
                                    {formData.bookFile && (
                                        <p className="text-xs text-gray-500 mt-1">Click to change</p>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    name="bookFile"
                                    ref={fileRef}
                                    onChange={handleChange}
                                    accept="application/pdf"
                                    className="hidden"
                                    required
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Add to Libraries
                    </label>

                    {loadingLibraries ? (
                        <div className="flex items-center text-gray-500">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                            Loading your libraries...
                        </div>
                    ) : libraries.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                            You haven't created any libraries yet. Create a library first to add books to it.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {libraries.map(library => (
                                <div key={library._id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`library-${library._id}`}
                                        value={library._id}
                                        checked={formData.libraries.includes(library._id)}
                                        onChange={handleLibraryChange}
                                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor={`library-${library._id}`}
                                        className="ml-2 text-sm text-gray-700"
                                    >
                                        {library.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center pt-2">
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

                {progress > 0 && (
                    <div className="pt-4">
                        <div className="flex justify-between mb-2 text-sm font-medium text-gray-700">
                            <span>Uploading...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                <div className="flex justify-center pt-6">
                    <button
                        type="submit"
                        disabled={progress > 0 && progress < 100}
                        className={`px-8 py-3 text-lg font-medium rounded-lg shadow-md transition-all duration-300 ${progress > 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 hover:shadow-lg transform hover:-translate-y-0.5'
                            }`}
                    >
                        {progress > 0 ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </div>
                        ) : (
                            "Add Book"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBookForm;