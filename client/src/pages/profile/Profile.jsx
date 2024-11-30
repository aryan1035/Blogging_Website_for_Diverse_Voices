import "./profile.scss"; 
import PlaceIcon from "@mui/icons-material/Place"; 
import LanguageIcon from "@mui/icons-material/Language"; 
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined"; 
import MoreVertIcon from "@mui/icons-material/MoreVert"; 
import Posts from "../../components/posts/Posts"; 
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"; // Import React Query hooks
import { makeRequest } from "../../axios"; // Import custom axios instance for API requests
import { useLocation } from "react-router-dom"; // Import useLocation hook to get the current URL path
import { useState } from "react"; // Import useState for managing component state
import { useContext } from "react"; // Import useContext for using context
import { AuthContext } from "../../context/authContext"; // Import AuthContext for accessing current user data
import Update from "../../components/update/Update"; // Import Update component to allow user profile updates

const Profile = () => {
  // State to control whether the update modal is open or not
  const [openUpdate, setOpenUpdate] = useState(false);


  // Get the current logged-in user from AuthContext
  const { currentUser } = useContext(AuthContext);
  

  // Extract the user ID from the URL path using useLocation hook
  const userId = parseInt(useLocation().pathname.split("/")[2]);


  // Fetch user data from the backend using React Query and makeRequest axios instance
  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => res.data)
  );


  // Fetch the relationship status (whether the current user is following the profile user)
  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => res.data)
  );


  // Initialize React Query client for cache invalidation
  const queryClient = useQueryClient();

  
  // Mutation for handling follow/unfollow action
  const mutation = useMutation(
    (following) => {
      // If already following, delete the relationship (unfollow)
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      // Otherwise, create a new relationship (follow)
      return makeRequest.post("/relationships", { userId });
    },
    {
      // On success, invalidate the "relationship" query to refetch data
      onSuccess: () => {
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  // Function to handle follow/unfollow when the follow button is clicked
  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id)); // Mutate the relationship based on current follow status
  };

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            {/* Cover image is removed */}
            <img
              src={"/upload/" + data.profilePic}
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                {/* Social media icons removed */}
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
                  "loading "
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
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
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
