import "./update.scss";
import { useState } from "react";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Update = ({ setOpenUpdate, user }) => {
  // State for storing the new profile picture and text inputs (name, city, website)
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    name: "",
    city: "",
    website: "",
  });

  // Function to upload a file (used for uploading profile picture)
  const upload = async (file) => {
    console.log(file);
    try {
      const formData = new FormData();
      formData.append("file", file); // Append file to form data
      const res = await makeRequest.post("/upload", formData); // POST request to upload the file
      return res.data; // Return the response data (image URL)
    } catch (err) {
      console.log(err); // Log any error that occurs during file upload
    }
  };

  // Handle changes in text input fields (name, city, website)
  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // React Query client instance to invalidate and refetch data
  const queryClient = useQueryClient();

  // Mutation to update user data (name, city, website, profilePic)
  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user); // PUT request to update user information
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]); // Invalidate and refetch user data on success
      },
    }
  );

  // Handle the click event to update the user information
  const handleClick = async (e) => {
  e.preventDefault(); // Prevent the default form submission

   let profileUrl = user.profilePic; // Default to the current user's profile picture
    // If a new profile picture is selected, upload it and get the new URL
   profileUrl = profile ? await upload(profile) : user.profilePic;

    // Call the mutation to update the user data (with new texts and profile picture)
   mutation.mutate({ ...texts, profilePic: profileUrl });

    // Close the update modal after successful update
    setOpenUpdate(false);
  };

  return (
    <div className="update">
      Update
      <form>
        <input type="file" onChange={(e) => setProfile(e.target.files[0])} />
        <input type="text" name="name" onChange={handleChange} />
        <input type="text" name="city" onChange={handleChange} />
        <input type="text" name="website" onChange={handleChange} />

        <button onClick={handleClick}>Update</button>
      </form>
      <button onClick={() => setOpenUpdate(false)}> X </button>
    </div>
  );
};

export default Update;
