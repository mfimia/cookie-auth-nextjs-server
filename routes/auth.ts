import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
} from "../controllers/auth";
import { requireSignIn } from "../middlewares";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/current-user", requireSignIn, currentUser);

module.exports = router;
