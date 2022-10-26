import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterPage from "./components/auth/RegisterPage";
import LoginPage from "./components/auth/LoginPage";
import SessionsPage from "./components/sessions/SessionsPage";
import Nav from "./components/Nav";
import AnalyticsPage from "./components/analytics/AnalyticsPage";
import ExercisesPage from "./components/exercises/ExercisesPage";

const muscleGroups = ["Chest", "Shoulders", "Biceps", "Triceps",
    "Forearms", "Traps", "Neck", "Lats", "Lower Back", "Abs",
    "Hamstrings", "Quads", "Glutes", "Calves", "Tibialis", "Cardio"];

const muscleGroupsForAnalytics = muscleGroups.slice();
muscleGroupsForAnalytics.unshift("All");

function App() {
    const baseUrl = process.env.REACT_APP_HOME_URL || "http://localhost:5000";

    const [message, setMessage] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const fetchUserUrl = `${baseUrl}/api/auth/getUser`;

    const fetchUser = useCallback(async () => {
        const response = await fetch(fetchUserUrl, { credentials: "include" });
        if (!response.ok) {
            throw new Error(`status ${response.status}`);
        }
        try {
            const json = await response.json();
            setMessage(json.message);
            setUser(json.user);
            setUserId(json.id);
            setIsFetching(false);
        } catch (e) {
            setMessage(`API call failed: ${e}`);
            setIsFetching(false);
        }
    }, [fetchUserUrl]);

    useEffect(() => {
        setIsFetching(true);
        fetchUser();
    }, [fetchUser]);

    const debugText = (
        <div>
            <p>
                {"« "}
                <strong>{isFetching ? "Fetching user " : message}</strong>
                {" »"}
            </p>
            {process.env.NODE_ENV === "production" ? (
                <p>This is a production build.</p>
            ) : (
                <p>You're not on PROD.</p>
            )}
        </div>
    );

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Nav user={user} />
                    <Routes>
                        <Route
                            exact
                            path="/"
                            element={<SessionsPage
                                user={user}
                                userId={userId}
                            />}
                        />
                        <Route
                            exact
                            path="/sessions"
                            element={
                                <SessionsPage
                                    user={user}
                                    userId={userId}
                                />
                            }
                        />
                        <Route
                            exact
                            path="/exercises"
                            element={
                                <ExercisesPage
                                    user={user}
                                    userId={userId}
                                    muscleGroups={muscleGroups}
                                />
                            }
                        />
                        <Route
                            exact
                            path="/analytics"
                            element={
                                <AnalyticsPage
                                    user={user}
                                    muscleGroups={muscleGroupsForAnalytics}
                                />
                            }
                        />
                        <Route exact path="/register" element={<RegisterPage />} />
                        <Route exact path="/login" element={<LoginPage />} />
                    </Routes>
                    {/* {debugText} */}
                </header>
            </div>
        </Router>
    );
}

export default App;
