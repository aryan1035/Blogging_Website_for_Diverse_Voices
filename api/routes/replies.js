import express from "express";
import { getReplies, addReply, deleteReply } from "../controllers/reply.js";

const router = express.Router();

router.get("/", getReplies); // Get replies for a comment
router.post("/", addReply); // Add a reply to a comment
router.delete("/:id", deleteReply); // Delete a reply by ID

export default router;
