import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ClientsPage from "./pages/ClientsPage";
import ProjectsPage from "./pages/ProjectsPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

const RoutesComponent = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/clients"
        element={token ? <ClientsPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/projects"
        element={token ? <ProjectsPage /> : <Navigate to="/login" />}
      />

      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default RoutesComponent;
