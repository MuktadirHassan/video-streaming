import { spawn } from "child_process";
import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import fs from "node:fs/promises";
import catchAsync from "../utils/catchAsync";
import getMediaDetails from "./getMediaDetails";
import processVideo from "./processVideo";
const abortController = new AbortController();

const mediaProcess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // use raw ffmpeg to process the video, ffprobe to get the metadata

    const file = req.file;
    if (!file) {
      return next(new Error("No file uploaded"));
    }
    logger.trace("File uploaded", file);

    // get the metadata
    const info = await getMediaDetails(file.path);
    // write the metadata to a file
    fs.writeFile(`${file.path.split(".")[0]}.json`, info.toString(), {
      flag: "w+", // Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists). # https://nodejs.org/api/fs.html#file-system-flags
    });

    // process the video
    const processed = await processVideo(file);
    if (!processed.success) {
      return next(new Error("Error processing video"));
    }

    // generate metadata
    const newInfo = await getMediaDetails(processed.outputPath);
    // write the metadata to a file
    fs.writeFile(
      `${processed.outputPath.split(".")[0]}.json`,
      newInfo.toString(),
      {
        flag: "w+", // Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists). # https://nodejs.org/api/fs.html#file-system-flags
      }
    );

    next();
  }
);

export default mediaProcess;
