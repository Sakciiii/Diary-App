import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Diary from "./pages/Diary";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/diary"
          element={
            <PrivateRoute>
              <Diary />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
