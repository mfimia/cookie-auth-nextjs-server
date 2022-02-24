import express from "express";
import cors from "cors";
import fs from "fs";
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use((_, __, next) => {
  console.log("this is my own middleware");
  next();
});

fs.readdirSync("./dist/routes").map((r) =>
  app.use("/api", () => {
    //   map files without .map extension
    const updatedFileName = r.substring(0, r.length - 3);
    console.log(updatedFileName);
    if (path.extname(r) !== ".map") require(`./routes/${updatedFileName}`);
  })
);

// const file = fs.readdirSync("./dist/routes");
// console.log(file);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
