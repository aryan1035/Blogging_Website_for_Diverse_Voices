import { db } from "../connect.js";
import jwt from "jsonwebtoken";

// Get user profile by user ID
export const getUser = (req, res) => {
  const userId = req.params.userId; // Extract user ID from request parameters
  const q = "SELECT * FROM user WHERE id=?"; // Query to get user details by ID

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err); // Handle database errors
    const { password, ...info } = data[0]; // Exclude password from the response
    return res.json(info); // Send user info in response
  });
};

// Update user profile
export const updateUser = (req, res) => {
  const token = req.cookies.accessToken; // Get the token from cookies
  if (!token) return res.status(401).json("Not authenticated!"); // If no token, return error

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); // If token is invalid, return error

    const q = "UPDATE user SET `name`=?, `city`=?, `website`=?, `profilePic`=? WHERE id=?";
    // Query to update user profile with new data

    db.query(
      q,
      [
        req.body.name, // Updated name
        req.body.city, // Updated city
        req.body.website, // Updated website
        req.body.profilePic, // Updated profile picture
        userInfo.id, // Only allow updating the profile of the logged-in user
      ],
      (err, data) => {
        if (err) return res.status(500).json(err); // Handle database errors
        if (data.affectedRows > 0) return res.json("Updated!"); // Return success if update successful
        return res.status(403).json("You can update only your profile!"); // Return error if trying to update someone else's profile
      }
    );
  });
};

// Search users by name
export const searchUser = (req, res) => {
  const { name } = req.query; // Get search query from URL parameter
  if (!name) {
    return res.status(400).json("Name query is required");
  }

  const q = "SELECT * FROM user WHERE name LIKE ?"; // Query to search users by name
  const searchQuery = `%${name}%`; // Use wildcards for partial matching

  db.query(q, [searchQuery], (err, data) => {
    if (err) return res.status(500).json(err); // Handle database errors
    const user = data.map(({ password, ...user }) => user); // Exclude password from results
    return res.json(user); // Send list of matching users
  });
};