import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PlayerDashboard from "./pages/PlayerDashboard";
import ScoutDashboard from "./pages/ScoutDashboard";
import PlayerProfile from "./pages/PlayerProfile";
import ScoutProfile from "./pages/ScoutProfile";
import VideoUpload from "./pages/VideoUpload";
import PlayersListing from "./pages/PlayersListing";
import PlayerDetails from "./pages/PlayerDetails";

// Компонент для выбора профиля в зависимости от роли
const ProfileRouter = () => {
  const { user } = useAuth();

  if (user?.role === "scout" || user?.role === "coach") {
    return <ScoutProfile />;
  }

  return <PlayerProfile />;
};

// Отдельный компонент для роутов (внутри AuthProvider)
const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid #334155",
          },
        }}
      />

      <Routes>
        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Главная */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <main>
                <Home />
              </main>
            </>
          }
        />

        {/* Player Dashboard */}
        <Route
          path="/player-dashboard"
          element={
            <>
              <Navbar />
              <main>
                <ProtectedRoute roles={["player", "parent"]}>
                  <PlayerDashboard />
                </ProtectedRoute>
              </main>
            </>
          }
        />

        {/* Scout Dashboard */}
        <Route
          path="/scout-dashboard"
          element={
            <>
              <Navbar />
              <main>
                <ProtectedRoute roles={["scout", "coach"]}>
                  <ScoutDashboard />
                </ProtectedRoute>
              </main>
            </>
          }
        />

        {/* Profile - для всех авторизованных ролей */}
        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <main>
                <ProtectedRoute roles={["player", "parent", "scout", "coach"]}>
                  <ProfileRouter />
                </ProtectedRoute>
              </main>
            </>
          }
        />

        {/* Video Upload - только для игроков */}
        <Route
          path="/upload-video"
          element={
            <>
              <Navbar />
              <main>
                <ProtectedRoute roles={["player"]}>
                  <VideoUpload />
                </ProtectedRoute>
              </main>
            </>
          }
        />

        {/* Players Listing (Поиск) - для скаутов и тренеров */}
        <Route
          path="/players"
          element={
            <>
              <Navbar />
              <main>
                <ProtectedRoute roles={["scout", "coach", "admin"]}>
                  <PlayersListing />
                </ProtectedRoute>
              </main>
            </>
          }
        />

        <Route
          path="/player/:id"
          element={
            <>
              <Navbar />
              <main>
                <ProtectedRoute roles={["scout", "coach", "admin"]}>
                  <PlayerDetails />
                </ProtectedRoute>
              </main>
            </>
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
