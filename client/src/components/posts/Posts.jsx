import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

// Define the Posts component which takes a userId as a prop
const Posts = ({ userId }) => {
  // Fetch posts for the given userId using React Query's useQuery hook
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts?userId=" + userId).then((res) => {
      return res.data; // Return the data from the response
    })
  );

  // Log the fetched data for debugging purposes
  console.log(data);
 return (
  <div className="posts">
    {error
      ? "Something went wrong!"
      : isLoading
      ? "loading"
      : data.map((post) => <Post post={post} key={post.id} />)}
  </div>
  );
};

export default Posts;
