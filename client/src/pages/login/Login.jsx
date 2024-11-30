import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  // State to hold the user input for username and password
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  
  // State to hold any error message
  const [err, setErr] = useState(null);

  // useNavigate hook to programmatically navigate to different routes
  const navigate = useNavigate();

  // Handles changes to the input fields (username, password)
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Retrieve the login function from AuthContext
  const { login } = useContext(AuthContext);

  // Handles the login process
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the default form submission
    try {
      // Attempt to login with the provided inputs
      await login(inputs);
      navigate("/"); // Navigate to home page on successful login
    } catch (err) {
      // If login fails, store the error message in the state
      setErr(err.response.data);
    }
  };

  return (
    <div className="login">
      <div className="card">
        {/* Left side: Information and Register link */}
        <div className="left">
          <p className="bold-text">Blogging Website for Diverse Voices</p>
          <p className="info">
            Sign up to share your voice, connect with others, and join a
            community of diverse bloggers. Start your journey today!
          </p>
          <span>Don't you have an account?</span>
          {/* Link to the registration page */}
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>

        {/* Right side: Login form */}
        <div className="right">
          <h1>Login</h1>
          <form>
            {/* Input field for username */}
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            {/* Input field for password */}
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {/* Display error message if exists */}
            {err && err}
            {/* Login button */}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
