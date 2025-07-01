import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

interface tForm {
    title: string;
    author: string;
    genre: string;
    publishedYear: number | string;
    publisher: string;
    coverImage: File | null;
    bookFile: File | null;
    libraries: string[]; // Add libraries field
    isPublic: boolean; // Add visibility field
}

interface Library {
    _id: string;
    name: string;
}

const AdminViewMyLibrary: React.FC = () => {
    const [formData, setFormData] = useState<tForm>({
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
        // Fetch user's libraries
        const fetchLibraries = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/libraries/my-libraries`,
                    { withCredentials: true }
                );
                setLibraries(response.data.data);
            } catch (error) {
                console.error("Error fetching libraries:", error);
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
            setErrorMessage("Please fill in all fields.");
            return;
        }

        try {
            const data = new FormData();
            // Text fields
            data.append("title", title);
            data.append("author", author);
            data.append("genre", genre);
            data.append("publishedYear", String(publishedYear));
            data.append("publisher", publisher);
            data.append("isPublic", String(formData.isPublic));

            // Append libraries
            formData.libraries.forEach(libraryId => {
                data.append("libraries[]", libraryId);
            });

            // Files
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

            setSuccessMessage(response.data.message);
            setErrorMessage(null);

            // Reset form
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
            setProgress(0);
        } catch (error: any) {
            setErrorMessage(
                error?.response?.data?.message ||
                error?.message ||
                "An error occurred while adding the book"
            );
            setSuccessMessage(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Add New Book</h2>

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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="CurrentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 text-black">
                {/* ... existing form fields ... */}

                {/* Library Selection */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Add to Libraries
                    </label>

                    {loadingLibraries ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : libraries.length === 0 ? (
                        <p className="text-gray-500">You haven't created any libraries yet.</p>
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

                {/* Visibility Toggle */}
                <div className="flex items-center">
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

                {/* ... existing file uploads and submit button ... */}
            </form>
        </div>
    );
};

export default AdminViewMyLibrary;