import express from "express";
import connectToMongo from "./db/mongoose";
import routes from "./routes";

const app = express();

let cors = require("cors");
app.use(cors());

let bodyParser = require("body-parser");
app.use(bodyParser.json());

let db = connectToMongo();

app.use("/", routes);

const PORT = 8000;
app.get("/", (req, res) => res.send("Express + TypeScript Server WORKS!"));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
