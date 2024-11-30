import axios from "axios"; // Import axios for making HTTP requests.
import { createContext, useEffect, useState } from "react"; // Import React functions for state and context handling.

export const AuthContext = createContext(); // Create a context for authentication data.


export const AuthContextProvider = ({ children }) => {
  // Define the provider component to wrap the app or specific components.
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null // Initialize user state with localStorage data or null if no user exists.
  );


  const login = async (inputs) => {
    // Define the login function to authenticate users.
    const res = await axios.post(
      "http://localhost:8800/api/auth/login",
      inputs,
      {
        withCredentials: true, // Send cookies with the request for authentication.
      }
    );

    setCurrentUser(res.data); // Update the user state with the response data (user information).
  };



  useEffect(() => {
    // Persist the user data to localStorage whenever it changes.
    localStorage.setItem("user", JSON.stringify(currentUser)); // Convert user data to a string and save it.
  }, [currentUser]); // Dependency: Runs whenever `currentUser` changes.



  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {" "}
      {/* Provide context values (currentUser and login function) to children components. */}
      {children}{" "}
      {/* Render the children components that need access to the context. */}
    </AuthContext.Provider>
  );
};
