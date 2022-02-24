import cors from "cors";
import express from "express";
import mongoose from "mongoose";
const morgan = require("morgan");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use((_, __, next) => {
  console.log("this is my own middleware");
  next();
});

app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
