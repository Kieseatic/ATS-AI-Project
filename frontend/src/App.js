import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UploadInterview from "./pages/UploadInterview";
import UploadResume from "./pages/UploadResume"; // Add this

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/upload-interview" element={<UploadInterview />} />
                <Route path="/upload-resume" element={<UploadResume />} /> {/* New Route */}
            </Routes>
        </Router>
    );
}

export default App;
