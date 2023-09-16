import express from "express";
import { randomFillSync } from "node:crypto";
import fs, { write } from "node:fs";
import path from "node:path";
import os from "node:os";

import { ServerError, handleGlobalError } from "./utils/Error";
import catchAsync from "./utils/catchAsync";
import { logger } from "./config/logger";
import sendApiResponse from "./utils/sendApiResponse";

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

const upload = fileUpload({
  folder: "videos",
  maxFileSize: 1024 * 1024 * 1000, // 10MB
});

app.post(
  "/api/v1/video/upload",
  upload,
  catchAsync(async (req, res) => {
    sendApiResponse(res, 200, "success");
  })
);

app.use(handleGlobalError);

export default app;

const random = (() => {
  const buf = Buffer.alloc(16);
  return () => randomFillSync(buf).toString("hex");
})();

type FileUploadConfig = {
  folder?: string;
  maxFileSize?: number;
  // allowedMimeTypes?: string[]; // TODO: add this
};

function fileUpload(config: FileUploadConfig) {
  const folder = config.folder ?? "uploads";
  const maxFileSize = config.maxFileSize ?? 1024 * 1024 * 10; // 10MB
  // const allowedMimeTypes = config.allowedMimeTypes ?? ["*/*"]; // TODO: add this

  if (!fs.existsSync(path.join(__dirname, "../", "public", folder))) {
    fs.mkdirSync(path.join(__dirname, "../", "public", folder));
  }

  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // read the request stream, and save the file to disk
    let fileBytes = 0;
    const writeStream = fs.createWriteStream(
      path.join(__dirname, "../", "public", folder, `${random()}.mp4`)
    );
    req.pipe(writeStream);

    req.on("data", (chunk) => {
      fileBytes += chunk.length;
      if (fileBytes > maxFileSize) {
        req.unpipe(writeStream);
        req.pause();
        next(new ServerError(400, "File size too large"));
      }
    });

    writeStream.on("unpipe", () => {
      logger.info("File stream unpiped");
      if (fileBytes > maxFileSize) {
        fs.unlink(writeStream.path, (err) => {
          if (err) {
            logger.error("Error deleting file from disk");
          }
          logger.info("File deleted from disk" + writeStream.path);
        });
      }
    });

    writeStream.on("error", (err) => {
      next(new Error(err.message));
    });

    writeStream.on("finish", () => {
      logger.info("File saved to disk");
      next();
    });
  };
}

function validateMimeTypes(mimeType: string, allowedMimeTypes: string[]) {
  if (allowedMimeTypes.includes("*/*")) {
    return true;
  }
  return allowedMimeTypes.includes(mimeType);
}
