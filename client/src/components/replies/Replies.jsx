import "./replies.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Replies = ({ commentId }) => {
  const queryClient = useQueryClient();

  const { currentUser } = useContext(AuthContext);

  // Fetch replies for the comment
  const { isLoading, error, data } = useQuery(["replies", commentId], () =>
    makeRequest.get("/replies?commentId=" + commentId).then((res) => res.data)
  );

  // Mutation for adding a reply
  const replyMutation = useMutation(
    (newReply) => makeRequest.post("/replies", newReply),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["replies", commentId]);
      },
    }
  );

  const handleReplySubmit = (e) => {
    e.preventDefault();
    const replyText = e.target[0].value;
    if (replyText.trim()) {
      replyMutation.mutate({ desc: replyText, commentId });
      e.target[0].value = "";
    }
  };

  if (isLoading) return <div>Loading replies...</div>;
  if (error) return <div>Something went wrong!</div>;

  return (
    <div className="replies">
      {data.length === 0 ? (
        <div>No replies yet</div>
      ) : (
        data.map((reply) => (
          <div className="reply" key={reply.id}>
            <div className="info">
              {/* Fix: Check if the profilePic exists, else use default image */}
              <img
                src={reply.profilePic ? `/upload/${reply.profilePic}` : "/default-profile.jpg"}
                alt="Profile"
              />
              <div className="details">
                <span className="name">{reply.name}</span>
                <p>{reply.desc}</p>
              </div>
            </div>
            <span className="date">{reply.createdAt}</span>
          </div>
        ))
      )}
      <form onSubmit={handleReplySubmit}>
        <input type="text" placeholder="Write a reply..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Replies;
