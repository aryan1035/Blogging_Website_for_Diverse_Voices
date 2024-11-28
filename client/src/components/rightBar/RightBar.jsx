
import "./rightBar.scss";

const RightBar = () => {
  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://media.cnn.com/api/v1/images/stellar/prod/230307102122-01-neymar-021423.jpg?c=16x9&q=h_833,w_1480,c_fill"
                alt=""
              />
              <span>Sanzid</span>
            </div>
            <div className="buttons">
              <button>follow</button>
              <button>dismiss</button>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://www.sportico.com/wp-content/uploads/2024/09/GettyImages-1734016483-e1726177787958.jpg?w=1280&h=719&crop=1"
                alt=""
              />
              <span>Nazmul</span>
            </div>
            <div className="buttons">
              <button>follow</button>
              <button>dismiss</button>
            </div>
          </div>
        </div>
        {}
      </div>
    </div>
  );
};

export default RightBar;
