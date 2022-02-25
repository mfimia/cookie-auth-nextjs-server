import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

module.exports = router;
