import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'
import './i18n';  

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


// 2. Unda QueryClient (weka nje ya render ili isijenge upya kila mara)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data itabaki fresh kwa dakika 5 (kupunguza maombi kwa seva)
      retry: 1, // Kama ikifeli, jaribu mara moja tu (sio mara 3)
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <React.StrictMode>
     {/* 3. Funga App yako yote hapa */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>

  </React.StrictMode>
);