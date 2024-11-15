import axios from "axios";

const backendURL = process.env.REACT_APP_BACKEND_URL;
console.log("Backend URL:", backendURL); // Check if the variable is loaded

// Function to upload interview
export const uploadInterview = async (formData) => {
    try {
        const response = await axios.post(`${backendURL}/api/upload_interview`, formData);
        return response.data;
    } catch (error) {
        console.error("Error uploading interview:", error);
        throw error;
    }
};

// Function to analyze interview
export const analyzeInterview = async (query, jobKeywords) => {
    try {
        const response = await axios.post(`${backendURL}/api/analyze`, {
            query,
            job_keywords: jobKeywords,
        });
        return response.data;
    } catch (error) {
        console.error("Error analyzing interview:", error);
        throw error;
    }
};
