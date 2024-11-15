import axios from "axios";

const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const uploadResume = async (formData) => {
    try {
        const response = await axios.post(`${backendURL}/api/upload_resume`, formData);
        return response.data;
    } catch (error) {
        console.error("Error uploading resume:", error);
        throw error;
    }
};
