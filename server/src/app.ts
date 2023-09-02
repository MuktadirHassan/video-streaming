import express from "express";
import { handleGlobalError } from "./utils/Error";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/_healthcheck", (req, res) => {
  res.send("OK");
});

app.use(handleGlobalError);

export default app;
