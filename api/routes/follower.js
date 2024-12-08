import express from "express";
import { getfollower, addfollower, deletefollower } from "../controllers/follower.js";

const router = express.Router()

router.get("/", getfollower)
router.post("/", addfollower)
router.delete("/", deletefollower)


export default router