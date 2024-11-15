import React, { useState } from "react";
import { uploadInterview, analyzeInterview } from "../api/interviewApi";

const UploadInterview = () => {
    const [file, setFile] = useState(null);
    const [metadata, setMetadata] = useState({ interviewee: "", position: "" });
    const [query, setQuery] = useState("");
    const [jobKeywords, setJobKeywords] = useState("");
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => setFile(e.target.files[0]);
    const handleMetadataChange = (e) =>
        setMetadata({ ...metadata, [e.target.name]: e.target.value });

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("interview_video", file);
        Object.entries(metadata).forEach(([key, value]) => formData.append(key, value));

        try {
            const response = await uploadInterview(formData);
            console.log("Upload Response:", response);
            alert("Interview uploaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to upload interview.");
        }
    };

    const handleAnalyze = async () => {
        try {
            const keywordsArray = jobKeywords.split(",").map((keyword) => keyword.trim());
            const response = await analyzeInterview(query, keywordsArray);
            setResult(response);
        } catch (error) {
            console.error(error);
            alert("Failed to analyze interview.");
        }
    };

    return (
        <div>
            <h1>Upload Interview</h1>
            <input type="file" onChange={handleFileChange} />
            <input
                type="text"
                name="interviewee"
                placeholder="Interviewee Name"
                onChange={handleMetadataChange}
            />
            <input
                type="text"
                name="position"
                placeholder="Position"
                onChange={handleMetadataChange}
            />
            <button onClick={handleUpload}>Upload</button>

            <h2>Analyze Interview</h2>
            <input
                type="text"
                placeholder="Query (e.g., 'Tell me about yourself')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <input
                type="text"
                placeholder="Job Keywords (comma-separated)"
                value={jobKeywords}
                onChange={(e) => setJobKeywords(e.target.value)}
            />
            <button onClick={handleAnalyze}>Analyze</button>

            {result && (
                <div>
                    <h3>Analysis Result</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default UploadInterview;
