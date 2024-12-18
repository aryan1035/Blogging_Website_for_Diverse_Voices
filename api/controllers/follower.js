import { db } from "../connect.js";
import jwt from "jsonwebtoken";

// Get all followers of a specific user
export const getfollower = (req, res) => {
  const q = "SELECT followerUserId FROM follower WHERE followedUserId = ?";

  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err); // Handle errors
    return res.status(200).json(data.map(follower => follower.followerUserId)); // Return list of follower user IDs
  });
};

// Add a relationship (follow a user)
export const addfollower = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!"); // Check if user is logged in

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); // Handle invalid token

    const q = "INSERT INTO follower (`followerUserId`, `followedUserId`) VALUES (?)";
    const values = [userInfo.id, req.body.userId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err); // Handle errors
      return res.status(200).json("Following"); // Return success message
    });
  });
};

// Delete a relationship (unfollow a user)
export const deletefollower = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!"); // Check if user is logged in

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); // Handle invalid token

    const q = "DELETE FROM follower WHERE `followerUserId` = ? AND `followedUserId` = ?";
    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err); // Handle errors
      return res.status(200).json("Unfollow"); // Return success message
    });
  });
};
