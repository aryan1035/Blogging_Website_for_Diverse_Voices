import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comment.js";
import likeRoutes from "./routes/likes.js";
import followerRoutes from "./routes/follower.js";
import replyRoutes from "./routes/replies.js"; 
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

// Set up file upload handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload"); // Ensure this path is correct
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename); // Return the filename of the uploaded file
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); 
app.use("/api/posts", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/follower", followerRoutes);
app.use("/api/replies", replyRoutes); 

app.listen(8800, () => {
  console.log("API working");
});
