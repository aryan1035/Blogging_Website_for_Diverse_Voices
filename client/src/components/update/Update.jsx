import "./update.scss";
import { useState, useEffect } from "react";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Update = ({ setOpenUpdate, user }) => {
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    name: user.name || "",
    city: user.city || "",
    website: user.website || "",
  });

  // Function to upload the file to the server
  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;  // Return the uploaded file URL
    } catch (err) {
      console.log(err);
    }
  };

  // Handle input field changes
  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Initialize the queryClient for cache invalidation
  const queryClient = useQueryClient();

  // Mutation hook to handle the user update
  const mutation = useMutation(
    (userData) => {
      return makeRequest.put("/user", userData);  // API call to update the user
    },
    {
      onSuccess: () => {
        // Invalidate the cache for user data and trigger a refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  // Handle form submission and update the user
  const handleClick = async (e) => {
    e.preventDefault();

    let profileUrl = user.profilePic;
    profileUrl = profile ? await upload(profile) : user.profilePic;  // Update profile picture if a new one is selected

    // Call the mutation to update the user data
    mutation.mutate({ ...texts, profilePic: profileUrl });
    setOpenUpdate(false);  // Close the update form after submission
  };

  // Effect to set the initial form values based on the `user` prop
  useEffect(() => {
    setTexts({
      name: user.name || "",
      city: user.city || "",
      website: user.website || "",
    });
  }, [user]); // Trigger the effect when the `user` prop changes

  return (
    <div className="update">
      <h2>Update Profile</h2>
      <form>
        {/* Profile image upload */}
        <input
          type="file"
          onChange={(e) => setProfile(e.target.files[0])} // Set the profile image
        />
        {/* Name input field */}
        <input
          type="text"
          name="name"
          value={texts.name}  // Set the value to the current state
          onChange={handleChange}  // Update the state on input change
        />
        {/* City input field */}
        <input
          type="text"
          name="city"
          value={texts.city}  // Set the value to the current state
          onChange={handleChange}  // Update the state on input change
        />
        {/* Website input field */}
        <input
          type="text"
          name="website"
          value={texts.website}  // Set the value to the current state
          onChange={handleChange}  // Update the state on input change
        />
        {/* Update button */}
        <button onClick={handleClick}>Update</button>
      </form>
      {/* Close button */}
      <button onClick={() => setOpenUpdate(false)} className="close">Close</button>
    </div>
  );
};

export default Update;
