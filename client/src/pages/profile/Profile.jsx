import "./profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"

const Profile = () => {
  return (
    <div className="profile">
      <div className="images">
        {}
        <img
          src="https://imageio.forbes.com/specials-images/imageserve/6545fb35ee5295c6716803b2/FC-Barcelona-will-probably-never-see-Lionel-Messi-wear-their-colours-again-/960x0.jpg?format=jpg&width=960"
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            {}
          </div>
          <div className="center">
            <span>Aryan</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>Chittagong</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>BWDV</span>
              </div>
            </div>
            <button>follow</button>
          </div>
          <div className="right">
            {}
          </div>
        </div>
      <Posts/>
      </div>
    </div>
  );
};

export default Profile;
