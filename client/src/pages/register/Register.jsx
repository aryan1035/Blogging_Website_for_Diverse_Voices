import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "", // Stores username input
    email: "", // Stores email input
    password: "", // Stores password input
    name: "", // Stores name input
  });


  const [err, setErr] = useState(null); // Error state for API response
  const [success, setSuccess] = useState(false); // Tracks registration success



  const handleChange = (e) => {
    // Update inputs state dynamically based on input field
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };



  const handleClick = async (e) => {
    e.preventDefault(); // Prevent form reload
    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs); // Send API request
      setSuccess(true); // Set success to true on success
      setErr(null); // Clear previous errors
    } catch (err) {
      setErr(err.response.data); // Display API error message
      setSuccess(false); // Reset success on failure
    }
  };


  
  return (
    <div className="register">
      <div className="card">
        <div className="left">
          {/* Description and link to login */}
          <p className="bold-text">Blogging Website for Diverse Voices</p>
          <p className="info">
            Create an account to start sharing your thoughts, connect with a
            community of bloggers, and explore diverse perspectives. Sign up
            today and be part of a space where your voice matters!
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button> {/* Redirect to login page */}
          </Link>
        </div>
        <div className="right">
          {/* Registration form */}
          <h1>Register</h1>
          <form>
            {/* Input fields for user details */}
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {/* Display error or success messages */}
            {err && <span className="error">{err}</span>} {/* Error message */}
            {success && <span className="success">Registration successful!</span>} {/* Success message */}
            <button onClick={handleClick}>Register</button> {/* Trigger registration */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
