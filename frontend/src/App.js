import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PlayerDashboard from "./pages/PlayerDashboard";
import ScoutDashboard from "./pages/ScoutDashboard";
import PlayerProfile from "./pages/PlayerProfile";
import VideoUpload from "./pages/VideoUpload";
import PlayersListing from "./pages/PlayersListing";
import PlayerDetails from "./pages/PlayerDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/player-dashboard"
                element={
                  <ProtectedRoute roles={["player"]}>
                    <PlayerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/scout-dashboard"
                element={
                  <ProtectedRoute roles={["scout", "coach"]}>
                    <ScoutDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute roles={["player"]}>
                    <PlayerProfile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/upload-video"
                element={
                  <ProtectedRoute roles={["player"]}>
                    <VideoUpload />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/players"
                element={
                  <ProtectedRoute roles={["scout", "coach", "admin"]}>
                    <PlayersListing />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/player/:id"
                element={
                  <ProtectedRoute roles={["scout", "coach", "admin"]}>
                    <PlayerDetails />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
