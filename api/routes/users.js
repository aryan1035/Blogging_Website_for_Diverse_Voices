import express from "express";
import { getUser, updateUser, searchUsers } from "../controllers/user.js";

const router = express.Router();

router.get("/find/:userId", getUser); // Route to get user by ID
router.put("/", updateUser); // Route to update user profile
router.get("/search", searchUsers); // Route to search users by name

export default router;
