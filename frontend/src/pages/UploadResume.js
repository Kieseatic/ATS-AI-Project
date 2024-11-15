import React, { useState } from "react";
import axios from "axios";

const UploadResume = () => {
    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState(null);
    const [result, setResult] = useState(null); // State to store analysis results

    // Handlers for file inputs
    const handleResumeChange = (e) => setResume(e.target.files[0]);
    const handleJobDescriptionChange = (e) => setJobDescription(e.target.files[0]);

    // Function to handle both resume and job description uploads and trigger analysis
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!resume || !jobDescription) {
            alert("Please upload both resume and job description.");
            return;
        }

        // Upload resume
        const resumeFormData = new FormData();
        resumeFormData.append("resume", resume);

        try {
            const resumeResponse = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/upload_resume`,
                resumeFormData
            );
            console.log("Resume Upload Response:", resumeResponse.data);
        } catch (error) {
            console.error("Error uploading resume:", error);
            alert("Failed to upload resume.");
            return;
        }

        // Upload job description
        const jobDescriptionFormData = new FormData();
        jobDescriptionFormData.append("job_description", jobDescription);

        try {
            const jobDescriptionResponse = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/upload_job_description`,
                jobDescriptionFormData
            );
            console.log("Job Description Upload Response:", jobDescriptionResponse.data);
        } catch (error) {
            console.error("Error uploading job description:", error);
            alert("Failed to upload job description.");
            return;
        }

        // Fetch analysis results (assuming analysis happens automatically)
        try {
            const analysisResponse = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/upload_resume`,
                resumeFormData
            ); // If this endpoint returns analysis
            setResult(analysisResponse.data); // Store the results
        } catch (error) {
            console.error("Error fetching analysis:", error);
            alert("Failed to fetch analysis.");
        }
    };

    return (
        <div>
            <h1>Upload Resume and Job Description</h1>

            <form onSubmit={handleSubmit}>
                {/* Resume Upload */}
                <label>
                    Upload Resume (PDF):
                    <input type="file" accept=".pdf" onChange={handleResumeChange} />
                </label>

                {/* Job Description Upload */}
                <label style={{ marginTop: "20px" }}>
                    Upload Job Description (JSON/TXT):
                    <input type="file" accept=".json,.txt" onChange={handleJobDescriptionChange} />
                </label>

                <button type="submit">Upload and Analyze</button>
            </form>

            {/* Display Analysis Results */}
            {result && (
                <div style={{ marginTop: "20px" }}>
                    <h2>Analysis Results</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default UploadResume;
