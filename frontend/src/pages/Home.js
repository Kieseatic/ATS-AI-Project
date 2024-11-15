import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>Welcome to the Job Matching System</h1>
            <Link to="/upload-interview">
                <button>Upload Interview</button>
            </Link>
            <Link to="/upload-resume" style={{ marginLeft: "10px" }}>
                <button>Upload Resume</button>
            </Link>
        </div>
    );
};

export default Home;
