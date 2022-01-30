import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Node.js authentication!" });
});

app.post("/api/post", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_SECRET, (err, authData) => {
    if (err) res.sendStatus(403);
    else {
      res.json({
        message: "Post created!",
        authData,
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  const { username, email, id } = req.body;
  const user = {
    username,
    email,
    id,
  };
  jwt.sign({ user }, process.env.TOKEN_SECRET, (err, token) => {
    res.json({ token });
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(5000, () => console.log("Server started at PORT:5000"));
