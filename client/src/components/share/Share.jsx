import "./share.scss";
import Image from "../../assets/img.png";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Share = () => {

  const {currentUser} = useContext(AuthContext)
  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img
            src="https://imageio.forbes.com/specials-images/imageserve/6545fb35ee5295c6716803b2/FC-Barcelona-will-probably-never-see-Lionel-Messi-wear-their-colours-again-/960x0.jpg?format=jpg&width=960"
            alt=""
          />
          <input type="text" placeholder={`What's on your mind,feel free to share.`} />
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display:"none"}} />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            {}
            {}
          </div>
          <div className="right">
            <button>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
