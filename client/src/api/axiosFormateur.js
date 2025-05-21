// src/api/axiosFormateur.js
import axios from "axios";

const apiFormateur = axios.create({
  baseURL: "/api/formateurs", // ou "/api/formateur" selon ton choix
});

apiFormateur.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiFormateur;
