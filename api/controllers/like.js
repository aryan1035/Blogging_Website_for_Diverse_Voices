import { db } from "../connect.js";
import jwt from "jsonwebtoken";

// Get all users who liked a specific post
export const getLikes = (req, res) => {
  const q = "SELECT userId FROM likes WHERE postId = ?";

  // Execute query to get likes for the specified postId
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err); 
    return res.status(200).json(data.map(like => like.userId)); // Return list of userIds who liked the post
  });
};

// Add a like to a post
export const addLike = (req, res) => {
  const token = req.cookies.accessToken; // Get the token from cookies
  if (!token) return res.status(401).json("Not logged in!"); 

  // Verify the token and get user info
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); 

    const q = "INSERT INTO likes (`userId`, `postId`) VALUES (?)"; // Query to add like to the post
    const values = [
      userInfo.id, // User ID from the token
      req.body.postId // Post ID to like
    ];

    // Execute the query to insert like into the database
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err); // Handle DB errors
      return res.status(200).json("Post has been liked."); // Return success message
    });
  });
};

// Remove a like from a post
export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken; // Get the token from cookies
  if (!token) return res.status(401).json("Not logged in!"); // If no token, user is not logged in

  // Verify the token and get user info
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); 

    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?"; // Query to remove like from the post

    // Execute the query to delete the like from the database
    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err); 
      return res.status(200).json("Post has been disliked.");
    });
  });
};