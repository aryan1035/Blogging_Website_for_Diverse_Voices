import "./comments.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Replies from "../replies/Replies"; // Import Replies component

const Comments = ({ postId }) => {
  const queryClient = useQueryClient();
  const [replyOpen, setReplyOpen] = useState({}); // To toggle replies visibility for specific comments

  const { currentUser } = useContext(AuthContext);

  // Fetch comments for the post
  const { isLoading, error, data } = useQuery(["comment", postId], () =>
    makeRequest.get("/comment?postId=" + postId).then((res) => res.data)
  );

  // Mutation for adding a comment
  const commentMutation = useMutation(
    (newComment) => makeRequest.post("/comment", newComment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comment", postId]);
      },
    }
  );

  // Mutation for deleting a comment
  const deleteCommentMutation = useMutation(
    (commentId) => makeRequest.delete(`/comment/${commentId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comment", postId]);
      },
    }
  );

  // Mutation for adding a reply
  const replyMutation = useMutation(
    (newReply) => makeRequest.post("/replies", newReply),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["replies", variables.commentId]);
      },
    }
  );

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const commentText = e.target[0].value;
    if (commentText.trim()) {
      commentMutation.mutate({ desc: commentText, postId });
      e.target[0].value = "";
    }
  };

  const handleReplySubmit = (e, commentId) => {
    e.preventDefault();
    const replyText = e.target[0].value;
    if (replyText.trim()) {
      replyMutation.mutate({ desc: replyText, commentId });
      e.target[0].value = "";
    }
  };

  const toggleReplies = (commentId) => {
    setReplyOpen((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleDeleteComment = (commentId) => {
    deleteCommentMutation.mutate(commentId);
  };

  if (isLoading) return <div>Loading comment...</div>;
  if (error) return <div>Something went wrong!</div>;

  return (
    <div className="comment">
      <form onSubmit={handleCommentSubmit}>
        <input type="text" placeholder="Write a comment..." />
        <button type="submit">Send</button>
      </form>
      {data.map((comment) => (
        <div className="comment" key={comment.id}>
          <div className="info">
            {/* Fix: Check if the profilePic exists, else use default image */}
            <img
              src={comment.profilePic ? `/upload/${comment.profilePic}` : "/default-profile.jpg"}
              alt="Profile"
            />
            <div className="details">
              <span className="name">{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
          </div>
          <span className="date">{comment.createdAt}</span>
          <div className="buttons">
            {comment.userId === currentUser.id && (
              <button onClick={() => handleDeleteComment(comment.id)} className="deleteButton">
                Delete
              </button>
            )}
            <button
              className="showRepliesButton"
              onClick={() => toggleReplies(comment.id)}
            >
              {replyOpen[comment.id] ? "Hide Replies" : "Show Replies"}
            </button>
          </div>
          {replyOpen[comment.id] && (
            <>
              <Replies commentId={comment.id} />
              <form onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                <input type="text" placeholder="Write a reply..." />
                <button type="submit">Send</button>
              </form>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Comments;
