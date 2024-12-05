import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

// Get posts for a specific user or for the logged-in user's feed
export const getPosts = (req, res) => {
  const userId = req.query.userId; // Get userId from query parameters
  const token = req.cookies.accessToken; // Get token from cookies
  if (!token) return res.status(401).json("Not logged in!"); // Check if the user is logged in

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); // Check if token is valid

    // If userId is provided, fetch posts for that user; otherwise, fetch posts from the user's feed
    const q =
      userId !== "undefined"
        ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ? 
        ORDER BY p.createdAt DESC`;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id]; // Values to pass into the query

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err); // Handle query error
      return res.status(200).json(data); // Return the posts data
    });
  });
};

// Add a new post for the logged-in user
export const addPost = (req, res) => {
  const token = req.cookies.accessToken; // Get token from cookies
  if (!token) return res.status(401).json("Not logged in!"); // Check if the user is logged in

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); // Check if token is valid

    const q = "INSERT INTO posts(`desc`,`img`,`createdAt`,`userId`) VALUES(?)"; // SQL query to add a post
    const values = [
      req.body.desc, // Post description
      req.body.img, // Post image URL
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), // Current timestamp for post creation
      userInfo.id, // User ID from the token
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err); // Handle query error
      return res.status(200).json("Post has been created"); // Return success message
    });
  });
};

// Delete a post if the user is the owner of the post
export const deletePost = (req, res) => {
  const token = req.cookies.accessToken; // Get token from cookies
  if (!token) return res.status(401).json("Not logged in!"); // Check if the user is logged in

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); // Check if token is valid

    const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?"; // SQL query to delete the post

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err); // Handle query error
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted."); // Check if post was deleted
      return res.status(403).json("You can delete only your post"); // If not, return error message
    });
  });
};
