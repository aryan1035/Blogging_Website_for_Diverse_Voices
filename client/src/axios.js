import axios from "axios";

// Create an axios instance with default settings
export const makeRequest = axios.create({
  baseURL: "http://localhost:8800/api/", // Set the base URL for the API
  withCredentials: true, // Allow sending cookies with requests (for authentication)
});
