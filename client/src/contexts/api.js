// src/contexts/api.js
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});
