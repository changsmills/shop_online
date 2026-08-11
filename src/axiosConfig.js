// src/axiosConfig.js
import axios from 'axios';

// 🔥 BADILISHA HII KUWA LOCALHOST KWA AJILI YA MAJARIBIO!
const api = axios.create({

 //baseURL: 'http://127.0.0.1:8000/api', 
  baseURL: 'https://shop-online-r9z4.onrender.com/api'

});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    
    // 🔥 Debug: Angalia hasa kwenye console
    console.log("🔑 [DEBUG] Token in LocalStorage:", token ? token.substring(0, 15) + "..." : "HAPANA");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Token inatumwa? NDIYO");
    } else {
      console.warn("🔑 Token inatumwa? HAPANA. Ombi litakataliwa na Backend.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;