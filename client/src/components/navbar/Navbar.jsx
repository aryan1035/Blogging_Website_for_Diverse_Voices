import "./navbar.scss";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../axios";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false); // Track when no results are found

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const res = await makeRequest.get(`/user/search?name=${searchQuery}`);
        setSearchResults(res.data);
        setNoResults(res.data.length === 0); // Check if no results were found
      } catch (err) {
        console.error("Search error:", err);
      }
    } else {
      setSearchResults([]);
      setNoResults(false); // Reset no results when clearing the input
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setNoResults(false);
    }
  }, [searchQuery]);

  const handleKeyUp = (e) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      navigate(`/profile/${searchResults[0].id}`);
    }
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".search")) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  });

  return (
    <div className={`navbar ${darkMode ? "dark" : ""}`}>
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Blogging Website for Diverse Voices</span>
        </Link>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} className="theme-toggle" />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} className="theme-toggle" />
        )}

        <div className="search">
          <SearchOutlinedIcon />
          <input
            type="text"
            placeholder="Search for user..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyUp={(e) => {
              handleKeyUp(e);
              if (e.key === "Enter") handleSearch();
            }}
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="search-result"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  <img
                    src={
                      user.profilePic
                        ? `/upload/${user.profilePic}?t=${new Date().getTime()}` // Adding a timestamp to prevent caching
                        : "/default-profile-pic.jpg"
                    }
                    alt={user.name}
                  />
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          )}
          {noResults && <div className="no-results">No user found.</div>}
        </div>
      </div>

      <div className="right">
        <div className="user">
          <img
            src={
              currentUser.profilePic
                ? `/upload/${currentUser.profilePic}?t=${new Date().getTime()}` // Adding a timestamp to prevent caching
                : "/default-profile-pic.jpg"
            }
            alt="Profile"
          />
          <button onClick={handleProfileClick} className="profile">
            <span>{currentUser.name}</span>
          </button>
        </div>
        <button onClick={handleLogout} className="logout-button">
          LogOut
        </button>
      </div>
    </div>
  );
};

export default Navbar;
