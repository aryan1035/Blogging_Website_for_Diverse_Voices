import "./profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  // Use useParams instead of useLocation for cleaner parameter handling
  const { id } = useParams();
  const userId = parseInt(id);

  const queryClient = useQueryClient();

  // Fetch user data
  const { isLoading, error, data, refetch } = useQuery(
    ["user", userId], // Add userId to the query key
    () => makeRequest.get("/users/find/" + userId).then((res) => res.data)
  );

  // Fetch relationship data
  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship", userId], // Add userId to the query key
    () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => res.data)
  );

  // Mutation for follow/unfollow actions
  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["relationship", userId]);
      },
    }
  );

  // Handle follow/unfollow action
  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  // Refetch data when the userId parameter changes
  useEffect(() => {
    refetch(); // Manually trigger a refetch for user data
  }, [userId, refetch]);

  return (
    <div className="profile">
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          <div className="images">
            <img
              src={data?.profilePic ? "/upload/" + data.profilePic : "/default-profile-pic.jpg"}
              alt={data?.name}
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left"></div>
              <div className="center">
                <span>{data?.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data?.city || "N/A"}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>
                      {data?.website ? (
                        <a href={data.website} target="_blank" rel="noopener noreferrer">
                          {data.website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                </div>
                {rIsLoading ? (
                  "Loading..."
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>Update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
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
            {/* Fetch posts related to user */}
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpen={setOpenUpdate} />}
    </div>
  );
};

export default Profile;
