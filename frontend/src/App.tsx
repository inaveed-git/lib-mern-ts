// src/App.tsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LibrarySection from "./components/LibrarySection";

import Dashboard from "./pages/Dashboard";
import { useRecoilValue } from "recoil";
import { userState } from "./recoil/atoms/userAtom";
import AuthPage from "./pages/AuthPage";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const user = useRecoilValue(userState);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: Show form if not logged in */}
        {!user && (
          <>
            <Route
              path="/"
              element={
                <AuthPage

                />
              }
            />
            {/* Catch all redirects to / if not logged in */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* Protected Routes: Only visible if user is logged in */}
        {user && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/library" element={<LibrarySection />} />
            {/* Redirect unknown paths to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
