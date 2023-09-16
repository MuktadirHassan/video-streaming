import express from "express";
import { handleGlobalError } from "./utils/Error";
import multer from "multer";
import catchAsync from "./utils/catchAsync";
import path from "node:path";
import fs from "node:fs/promises";
import { randomFillSync } from "node:crypto";
import sendApiResponse from "./utils/sendApiResponse";

const random = (() => {
  const buf = Buffer.alloc(16);
  return () => randomFillSync(buf).toString("hex");
})();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static("public"));
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "..", "public", "videos"));
    },
    filename: (req, file, cb) => {
      cb(null, `${random()}${path.extname(file.originalname)}`);
    },
  }),
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get(
  "/api/v1/videos",
  catchAsync(async (req, res) => {
    // send a list of videos
    const dir = path.join(__dirname, "..", "public", "videos");
    const fsr = await fs.readdir(dir);
    const url = `${req.protocol}://${req.get("host")}/videos`;
    const videos = fsr.map((f) => ({
      name: f,
      url: `${url}/${f}`,
    }));
    sendApiResponse(res, 200, "Success", videos);
  })
);

app.post(
  "/api/v1/video/upload",
  upload.single("video"),
  catchAsync(async (req, res) => {
    const { file } = req;
    res.send(file);
  })
);

app.use(handleGlobalError);

export default app;
