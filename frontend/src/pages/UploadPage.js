import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UploadResume from "./UploadResume";
import UploadJobDescription from "./UploadJobDescription";

const UploadPage = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul style={{ display: "flex", gap: "10px", listStyleType: "none" }}>
                        <li>
                            <Link to="/upload/resume">Upload Resume</Link>
                        </li>
                        <li>
                            <Link to="/upload/job-description">Upload Job Description</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/upload/resume" element={<UploadResume />} />
                    <Route path="/upload/job-description" element={<UploadJobDescription />} />
                </Routes>
            </div>
        </Router>
    );
};

export default UploadPage;
