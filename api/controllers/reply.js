import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

// Get replies for a comment
export const getReplies = (req, res) => {
  const q = `SELECT r.*, u.id AS userId, name, profilePic 
             FROM reply AS r
             JOIN users AS u ON (u.id = r.userId)
             WHERE r.commentId = ? ORDER BY r.createdAt DESC`;

  db.query(q, [req.query.commentId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// Add a reply to a comment
export const addReply = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO reply(`desc`, `createdAt`, `userId`, `commentId`) VALUES (?)";
    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.commentId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Reply has been created.");
    });
  });
};

// Delete a reply
export const deleteReply = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const replyId = req.params.id;  // Use replyId from the URL params

    const q = "DELETE FROM reply WHERE `replyid` = ? AND `userId` = ?";  // Ensure correct column names
    db.query(q, [replyId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows === 0)
        return res.status(403).json("You can only delete your own replies!");

      return res.status(200).json("Reply has been deleted.");
    });
  });
};
