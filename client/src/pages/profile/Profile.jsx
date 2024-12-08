import "./profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const queryClient = useQueryClient();

  // Fetch user data based on the userId from the URL
  const { isLoading, error, data, refetch } = useQuery(
    ["user", userId],
    () => makeRequest.get("/user/find/" + userId).then((res) => res.data),
    {
      enabled: !!userId, // Only run the query if userId is available
    }
  );

  // Fetch relationship data based on userId
  const { isLoading: rIsLoading, data: followerData } = useQuery(
    ["follower", userId],
    () =>
      makeRequest.get("/follower?followedUserId=" + userId).then((res) => res.data),
    {
      enabled: !!userId, // Only run the query if userId is available
    }
  );

  // Handle follow/unfollow functionality
  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/follower?userId=" + userId);
      return makeRequest.post("/follower", { userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["follower"]);
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(followerData.includes(currentUser.id));
  };

  // Refetch data when userId changes (e.g., when navigating between profiles)
  useEffect(() => {
    if (userId) {
      refetch(); // Manually trigger a refetch when userId changes
    }
  }, [userId, refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="profile">
      <div className="images">
        {/* Keep the original orientation */}
        <img src={"/upload/" + data.profilePic} alt="" className="profilePic" />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            {/* Social media icons */}
          </div>
          <div className="center">
            <span>{data?.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data?.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data?.website}</span>
              </div>
            </div>
            {rIsLoading ? (
              "loading"
            ) : userId === currentUser.id ? (
              <button onClick={() => setOpenUpdate(true)}>Update</button>
            ) : (
              <button onClick={handleFollow}>
                {followerData.includes(currentUser.id)
                  ? "Following"
                  : "Follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={userId} />
      </div>
      {openUpdate && data && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
