import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminManageBooks from "./AdminManageBooks";
import DashSideBar from "../components/DashSideBar";
import AddBookForm from "../components/AddBookForm";
import BookList from "./BookList";
import CreateLibraryPage from "./CreateLibraryPage";
import MyLibrariesPage from "./MyLibrariesPage";
import LibraryDetailsPage from "./LibraryDetailsPage";
import AddBooksToLibraryPage from "./AddBooksToLibraryPage";

const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");
    const queryParams = new URLSearchParams(location.search);
    const libraryId = queryParams.get("libraryId");

    useEffect(() => {
        const tabFromUrl = queryParams.get("tab");
        if (tabFromUrl) setTab(tabFromUrl);
    }, [location.search]);

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[#0f1a2f] to-[#1a2a3a] text-white">
            <DashSideBar />

            <div className="flex-1 md:ml-56 p-4 md:p-">
                <header className="mb-6 p-4 bg-[rgba(26,32,44,0.7)] rounded-xl shadow-lg border border-[#2d3e50]">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">
                            {tab === "AdminDash" && "Dashboard"}
                            {tab === "create-book" && "New Book"}
                            {tab === "AdminBook" && "Manage Books"}
                            {tab === "BookList" && "Books List"}
                            {tab === "create-library" && "Create Library"}
                            {tab === "my-libraries" && "My Libraries"}
                            {tab === "library-details" && "Library Details"}
                            {tab === "add-books" && "Add Books to Library"}
                        </h1>
                    </div>
                </header>

                <div className="bg-[rgba(26,32,44,0.7)] rounded-xl shadow-lg p-6 min-h-[50vh] border border-[#2d3e50]">
                    {tab === "AdminDash" && <AdminDashboard />}
                    {tab === "create-book" && <AddBookForm />}
                    {tab === "AdminBook" && <AdminManageBooks />}
                    {tab === "BookList" && <BookList />}
                    {tab === "create-library" && <CreateLibraryPage />}
                    {tab === "my-libraries" && <MyLibrariesPage />}
                    {tab === "library-details" && <LibraryDetailsPage />}
                    {tab === "add-books" && <AddBooksToLibraryPage />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;