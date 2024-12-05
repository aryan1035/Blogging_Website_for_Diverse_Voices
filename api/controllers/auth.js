import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register new user
export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err); // Handle DB errors
    if (data.length) return res.status(409).json("User already exists!"); // Check if username is taken
    
    // Hash the password using bcrypt
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users (`name`,`username`,`email`,`password`) VALUE (?)";
    const values = [req.body.name, req.body.username, req.body.email, hashedPassword];

    // Insert new user into the database
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err); // Handle errors
      return res.status(200).json("User has been created."); // Success message
    });
  });
};

// Login user
export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err); // Handle DB errors
    if (data.length === 0) return res.status(404).json("User not found!"); // Username not found

    // Compare entered password with stored hashed password
    const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
    if (!checkPassword) return res.status(400).json("Wrong password or username!"); // Invalid password

    // Generate JWT token with user ID as payload
    const token = jwt.sign({ id: data[0].id }, "secretkey"); 

    const { password, ...others } = data[0]; // Exclude password from response

    // Send the token as a cookie
    res.cookie("accessToken", token, { httpOnly: true })
      .status(200)
      .json(others); // Respond with user details excluding password
  });
};

// Logout user
export const logout = (req, res) => {
  // Clear the access token cookie
  res.clearCookie("accessToken", { httpOnly: true, secure: false, sameSite: "lax" })
    .status(200)
    .json("User has been logged out.");
};
