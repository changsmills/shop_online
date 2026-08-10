import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
//import './App.css';      /* ✅ App.css imepakiwa */
//import './index.css';    /* ✅ ONGEZA HII! Hapa ndipo variables ziko! */
import './i18n';  

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);