import "./share.scss";
import Image from "../../assets/img.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Share = () => {
  const [file, setFile] = useState(null); // State for storing the selected file
  const [desc, setDesc] = useState(""); // State for storing the post description

  // Function to handle file upload
  const upload = async () => {
    try {
      const formData = new FormData(); // Create FormData object
      formData.append("file", file); // Append the file to the form data
      const res = await makeRequest.post("/upload", formData); // POST request to upload the file
      return res.data; // Return the response data (image URL)
    } catch (err) {
      console.log(err); // Log any errors during the upload
    }
  };

  const { currentUser } = useContext(AuthContext); // Get the current logged-in user from context

  const queryClient = useQueryClient(); // Get the query client for data invalidation

  // Mutation for creating a new post
  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("/posts", newPost); // POST request to create a new post
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]); // Invalidate the posts query to refresh the post list
      },
    }
  );

  // Handle the "Share" button click
  const handleClick = async (e) => {
    let imgUrl = "";
    if (file) imgUrl = await upload(); // If there is a file, upload it and get the image URL
    mutation.mutate({ desc, img: imgUrl }); // Create a new post with description and image URL
    setDesc(""); // Reset the description field
    setFile(null); // Reset the file state
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={currentUser.profilePic} alt="" /> {/* Display current user's profile picture */}
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`} // Input placeholder with user name
              onChange={(e) => setDesc(e.target.value)} // Update description state on input change
              value={desc} // Bind the description value to the state
            />
          </div>
          <div className="right">
            {/* Display the selected image if a file is chosen */}
            {file && <img className="file" alt="" src={URL.createObjectURL(file)} />}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            {/* Hidden file input to select image */}
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])} // Set the selected file to state
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" /> {/* Display the "Add Image" icon */}
                <span>Add Image</span> {/* Display "Add Image" text */}
              </div>
            </label>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button> {/* Share button to create a new post */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
