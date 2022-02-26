import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";
const morgan = require("morgan");
require("dotenv").config();

const csrfProtection = csrf({ cookie: true });

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

const app = express();

app.set("trust proxy", 1);

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", require("./routes/auth"));

app.use(csrfProtection);
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
