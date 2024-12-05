import "./navbar.scss";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../axios";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await makeRequest.post("/auth/logout");
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
    <div className={`navbar ${darkMode ? "dark" : ""}`}>
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Blogging Website for Diverse Voices</span>
        </Link>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
      </div>
      <div className="right">
        <div className="user">
          <img
            src={currentUser.profilePic ? `/upload/${currentUser.profilePic}` : '/default-profile-pic.jpg'}
            alt="Profile"
          />
          <button onClick={handleProfileClick}>
            <span>{currentUser.name}</span>
          </button>
        </div>
        <button onClick={handleLogout}>LogOut</button>
      </div>
    </div>
  );
};

export default Navbar;
