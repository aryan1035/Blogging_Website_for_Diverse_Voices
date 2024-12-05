import "./posts.scss";
import Post from "../post/Post";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

// Define the Posts component which takes a userId as a prop
const Posts = ({ userId }) => {
  // Fetch posts for the given userId using React Query's useQuery hook
  const { isLoading, error, data } = useQuery(["posts", userId], () =>
    makeRequest
      .get(`/posts?userId=${userId}`) // Fetch posts based on userId
      .then((res) => res.data) // Return the data directly from the response
  );

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>; // This could be replaced with a spinner or loading animation
  }

  // Handle error state
  if (error) {
    return <div>Something went wrong!</div>;
  }

  // Handle case when there are no posts
  if (data.length === 0) {
    return <div>No posts available</div>;
  }

  return (
    <div className="posts">
      {data.map((post) => (
        <Post post={post} key={post.id} /> // Render each post using the Post component
      ))}
    </div>
  );
};

export default Posts;
