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
    makeRequest.get(`/replies?commentId=${commentId}`).then((res) => res.data)
  );

  // Mutation for deleting a reply
  const deleteReplyMutation = useMutation(
    (replyId) => makeRequest.delete(`/replies/${replyId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["replies", commentId]);
      },
    }
  );

  const handleDeleteReply = (replyId) => {
    console.log("Deleting reply with ID:", replyId); // Debugging
    deleteReplyMutation.mutate(replyId);
  };

  if (isLoading) return <div>Loading replies...</div>;
  if (error) return <div>Something went wrong!</div>;

  console.log("Replies Data:", data); // Debugging fetched data

  return (
    <div className="replies">
      {data.map((reply) => (
        <div className="reply" key={reply.replyid}> {/* Ensure reply.replyid is used */}
          <div className="info">
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
          {reply.userId === currentUser.id && (
            <button className="delete-button" onClick={() => handleDeleteReply(reply.replyid)}>
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Replies;
