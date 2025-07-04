// src/App.tsx (updated)
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "./recoil/atoms/userAtom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManageBooks from "./pages/AdminManageBooks";
import PrivateRoute from "./components/PrivateRoute";
import SuperAdmin_Admin_PrivateRoute from "./components/SuperAdmin_Admin_PrivateRoute";
import useLoadUser from "./hook/useLoadUser";
import AddBookForm from "./components/AddBookForm";
import HomePage from "./pages/HomePage";
import LibraryDetailsPage from "./pages/LibraryDetailsPage";
import CreateLibraryPage from "./pages/CreateLibraryPage";
import AddBooksToLibraryPage from "./pages/AddBooksToLibraryPage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Navbar from "./components/Navbar";
import Layout from "./pages/Layout";
import LibrariesPage from "./pages/LibrariesPage";
import AboutPage from "./pages/AboutPage";

const App: React.FC = () => {
  useLoadUser();
  const { user, isLoading } = useRecoilValue(userState);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>


        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/lib" element={<LibrariesPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* <Route path="/libraries" element={<LibrariesPage />} /> */}
          <Route path="/login" element={<AuthPage />} />
        </Route>


        {/* <Route path="/" element={<Navbar />} /> */}
        {/* <Route path="/home" element={<HomePage />} /> */}

        <Route element={<PrivateRoute />}>



          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-library" element={<CreateLibraryPage />} />
          <Route path="/library/:libraryId" element={<LibraryDetailsPage />} />
          <Route path="/library/:libraryId/add-books" element={<AddBooksToLibraryPage />} />
          <Route path="LibraryDetailsPage" element={<LibraryDetailsPage />} />
        </Route>

        <Route element={<SuperAdmin_Admin_PrivateRoute />}>

          <Route path="/super-admin" element={

            <SuperAdminDashboard />

          } />


          <Route path="/create-book" element={<AddBookForm />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/AdminLibrary" element={<AdminManageBooks />} />
        </Route>

        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;