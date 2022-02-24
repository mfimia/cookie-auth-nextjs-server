import express from "express";

const router = express.Router();

router.get("/register", (_, res) => {
  res.send("register user");
});

module.exports = router;
