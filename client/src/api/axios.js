import axios from "axios";

// Instance Axios partagée pour l'admin
const api = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

// Intercepteur pour injecter automatiquement le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
