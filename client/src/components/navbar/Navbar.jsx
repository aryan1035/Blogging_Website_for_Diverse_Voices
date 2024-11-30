import "./navbar.scss";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../axios";

const Navbar = ({isLoggedIn, setIsLoggedIn}) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await makeRequest.post("/auth/logout"); // Ensure you have a logout route
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  const handleProfileClick = () => {
    navigate(`/profile/${currentUser.id}`);
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Blogging Website for Diverse Voices</span>
        </Link>
      </div>
      <div className="right">
        <div className="user">
          <img src={currentUser.profilePic} alt="" />
          <button onClick={handleProfileClick} >
          <span>{currentUser.name}</span>
          </button>

        </div>
        <button onClick={handleLogout}>LogOut</button>
      </div>
    </div>
  );
};

export default Navbar;
