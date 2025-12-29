import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PlayerDashboard from "./pages/PlayerDashboard";
import ScoutDashboard from "./pages/ScoutDashboard";
import PlayerProfile from "./pages/PlayerProfile";
import VideoUpload from "./pages/VideoUpload";
import PlayersListing from "./pages/PlayersListing";
import PlayerDetails from "./pages/PlayerDetails";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-surface text-foreground transition-colors">
            <Toaster position="top-right" />

            <Routes>
              {/* Auth pages – отдельный layout */}
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

              {/* Дашборды и защищённые страницы */}
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

              <Route
                path="/profile"
                element={
                  <>
                    <Navbar />
                    <main>
                      <ProtectedRoute roles={["player"]}>
                        <PlayerProfile />
                      </ProtectedRoute>
                    </main>
                  </>
                }
              />

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
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
