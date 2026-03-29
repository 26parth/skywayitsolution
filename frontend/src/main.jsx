import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store"; // tumhare store.js ka path


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>                  {/* Redux */}
      <QueryClientProvider client={queryClient}> {/* React Query */}
        <BrowserRouter>
          <GoogleOAuthProvider clientId="959112020039-1k2irt3fdu71gk11d2nl0vosa7oi780p.apps.googleusercontent.com">
            <App />
          </GoogleOAuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
