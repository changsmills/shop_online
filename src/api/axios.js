// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  // FastAPI kwa kawaida inatumia port 8000
  baseURL: "http://127.0.0.1:8000", 
  headers: {
    "Content-Type": "application/json"
  }
});

export default instance;