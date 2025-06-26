import React from "react";
import { useRecoilValue } from "recoil";
import { Navigate, Outlet } from "react-router-dom";
import { userState } from "../recoil/atoms/userAtom";

const PrivateRoute = () => {
    const { user, isLoading } = useRecoilValue(userState);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;