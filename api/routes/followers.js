import express from "express";
import { getfollowers, addfollowers, deletefollowers } from "../controllers/followers.js";

const router = express.Router()

router.get("/", getfollowers)
router.post("/", addfollowers)
router.delete("/", deletefollowers)


export default router