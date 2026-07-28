// src/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  /* 🔥 BADILISHA HAPA: Kutoka localhost hadi URL ya Render */
  baseURL: 'https://shop-online-r9z4.onrender.com/api',
});

// Kila ombi linaongeza token kiotomatiki!
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    console.log("🔑 Token inatumwa?", token ? "NDIYO" : "HAPANA"); // 🔥 Debug
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;