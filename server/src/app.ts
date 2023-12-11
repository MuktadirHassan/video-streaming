import express from "express";
import { handleGlobalError } from "./utils/Error";
import multer from "multer";
import catchAsync from "./utils/catchAsync";
import path from "node:path";
import fs from "node:fs/promises";
import { randomFillSync } from "node:crypto";
import sendApiResponse from "./utils/sendApiResponse";
import mediaProcess from "./middlewares/mediaProcess";
import cors from "cors";

const random = (() => {
  const buf = Buffer.alloc(16);
  return () => randomFillSync(buf).toString("hex");
})();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
    const processedDir = path.join(__dirname, "..", "public", "processed");
    const fsr = await fs.readdir(dir);
    const processedFsr = await fs.readdir(processedDir);
    const baseUrl = req.protocol + "://" + req.get("host");

    let names: any[] = [];
    const videos = fsr.map((f) => {
      const [name] = f.split(".");
      if (names.includes(name)) return null;
      names.push(name);

      const processedMeta = processedFsr.find(
        (pf) => name && pf.startsWith(name) && pf.endsWith(".json")
      );
      const processed = processedFsr.find(
        (pf) => name && pf.startsWith(name) && !pf.endsWith(".json")
      );

      const urlMeta = fsr.find((pf) => name && pf.startsWith(name));
      const url = fsr.find(
        (pf) => name && pf.startsWith(name) && !pf.endsWith(".json")
      );

      return {
        baseUrl,
        name: f,
        source: {
          url: `${baseUrl}/videos/${url}`,
          meta: `${baseUrl}/videos/${urlMeta}`,
        },
        processed: {
          url: `${baseUrl}/processed/${processed}`,
          meta: `${baseUrl}/processed/${processedMeta}`,
        },
      };
    });
    sendApiResponse(res, 200, "Success", {
      videos: videos.filter((v) => v),
    });
  })
);

app.post(
  "/api/v1/video/upload",
  upload.single("video"),
  mediaProcess,
  catchAsync(async (req, res) => {
    const { file } = req;
    res.send(file);
  })
);

app.use(handleGlobalError);

export default app;
