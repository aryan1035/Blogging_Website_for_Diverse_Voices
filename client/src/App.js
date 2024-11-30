import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./style.scss";
import { useContext, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  // Get the current user from the AuthContext
  const { currentUser } = useContext(AuthContext);

  // State to manage login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Get the current theme mode (dark or light)
  const { darkMode } = useContext(DarkModeContext);

  // Initialize the QueryClient for react-query
  const queryClient = new QueryClient();

  // Layout component: Contains Navbar and main content
  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        {/* Apply the dark or light theme based on darkMode context */}
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          {/* Pass the isLoggedIn state to Navbar */}
          <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <div style={{ display: "flex" }}>
            {/* LeftBar and RightBar are placeholders for future components */}
            {/* <LeftBar /> */}
            
            {/* Main Content */}
            <div style={{ flex: 6 }}>
              <Outlet /> {/* Render the child routes here */}
            </div>

            {/* <RightBar /> */}
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  // ProtectedRoute component: Ensures that the user is logged in before accessing protected routes
  const ProtectedRoute = ({ children }) => {
    // Redirect to login page if the user is not authenticated
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  // Define the router with routes and their corresponding components
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        // Wrap the layout in a ProtectedRoute to ensure authentication
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />, // Home page route
        },
        {
          path: "/profile/:id",
          element: <Profile />, // Profile page route
        },
      ],
    },
    {
      path: "/login",
      element: <Login />, // Login page route
    },
    {
      path: "/register",
      element: <Register />, // Register page route
    },
  ]);

  return (
    <div>
      {/* RouterProvider: This is where the routing happens in the app */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
