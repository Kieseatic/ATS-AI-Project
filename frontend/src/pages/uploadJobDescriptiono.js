import React, { useState } from "react";
import axios from "axios";

const UploadJobDescription = () => {
    const [jobDescription, setJobDescription] = useState(null);

    const handleJobDescriptionChange = (e) => setJobDescription(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("job_description", jobDescription);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/upload_job_description`, formData);
            console.log(response.data);
            alert("Job description uploaded successfully!");
        } catch (error) {
            console.error("Error uploading job description:", error);
            alert("Failed to upload job description.");
        }
    };

    return (
        <div>
            <h1>Upload Job Description</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Upload Job Description (.txt/.json): </label>
                    <input type="file" accept=".txt,.json" onChange={handleJobDescriptionChange} />
                </div>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default UploadJobDescription;
