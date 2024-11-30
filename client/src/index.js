import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";  // Provide authentication context
import { DarkModeContextProvider } from "./context/darkModeContext";  // Provide dark mode context

const root = ReactDOM.createRoot(document.getElementById("root"));  // Get the root element where the app will be rendered
root.render(
  <React.StrictMode>
    {/* Provide contexts to the entire app */}
    <DarkModeContextProvider>  
      <AuthContextProvider>
        <App />  {/* Render the main App component */}
      </AuthContextProvider>
    </DarkModeContextProvider>
  </React.StrictMode>
);
