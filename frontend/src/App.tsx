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

const App: React.FC = () => {
  useLoadUser();
  const { user, isLoading } = useRecoilValue(userState);

  return (
    <BrowserRouter>



      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<SuperAdmin_Admin_PrivateRoute />}>
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