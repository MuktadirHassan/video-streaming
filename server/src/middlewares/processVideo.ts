import { spawn } from "child_process";
import { logger } from "../config/logger";

const availableCodecs = [
  {
    label: "H.264",
    codec: "libx264",
    description:
      "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10 (encoders: libx264 )",
  },
  {
    label: "H.265",
    codec: "libx265",
    description: "H.265 / HEVC (encoders: libx265 )",
  },
  {
    label: "VP8",
    codec: "libvpx",
    description: "On2 VP8 (encoders: libvpx )",
  },
  {
    label: "VP9",
    codec: "libvpx-vp9",
    description: "Google VP9 (encoders: libvpx-vp9 )",
  },
  {
    label: "AV1",
    codec: "libaom-av1",
    description: "Alliance for Open Media AV1 (encoders: libaom-av1 )",
  },
];
const selectedCodec = availableCodecs[1];

const availableContainers = [
  {
    label: "MP4",
    container: "mp4",
    description: "MP4 (MPEG-4 Part 14)",
  },
  {
    label: "MKV",
    container: "mkv",
    description: "Matroska",
  },
  {
    label: "WebM",
    container: "webm",
    description: "WebM",
  },
];
const selectedContainer = availableContainers[0];

const availableResolutions = [
  {
    label: "1080p",
    resolution: "1920x1080",
    description: "1080p Full HD (1920x1080)",
  },
  {
    label: "720p",
    resolution: "1280x720",
    description: "720p HD (1280x720)",
  },
  {
    label: "480p",
    resolution: "854x480",
    description: "480p (854x480)",
  },
  {
    label: "360p",
    resolution: "640x360",
    description: "360p (640x360)",
  },
];

const selectedResolution = availableResolutions[0];

const audioCodecs = [
  {
    label: "AAC",
    codec: "aac",
    description: "AAC (Advanced Audio Coding)",
  },
  {
    label: "Opus",
    codec: "libopus",
    description: "Opus (Opus Interactive Audio Codec)",
  },
];

const selectedAudioCodec = audioCodecs[0];

const defaultConfig = {
  videoCodec: selectedCodec as (typeof availableCodecs)[0],
  container: selectedContainer as (typeof availableContainers)[0],
  resolution: selectedResolution as (typeof availableResolutions)[0],
  audioCodec: selectedAudioCodec as (typeof audioCodecs)[0],
  audioBitrate: 128,
  videoBitrate: 1000,
  framerate: 30,
  crf: 23,
};

function processVideo(file: Express.Multer.File, config = defaultConfig) {
  return new Promise<{
    success: boolean;
    outputPath: string;
  }>((resolve, reject) => {
    const { path: inputPath } = file;
    if (!inputPath) throw new Error("No valid input path");

    const {
      videoCodec,
      container,
      resolution,
      audioCodec,
      audioBitrate,
      videoBitrate,
      framerate,
    } = config;

    const ffmpegCommand = [];

    ffmpegCommand.push("-i", inputPath);

    if (videoCodec.codec) {
      ffmpegCommand.push("-c:v", videoCodec.codec);
    }

    if (audioCodec.codec) {
      ffmpegCommand.push("-c:a", audioCodec.codec);
    }

    if (audioBitrate) {
      ffmpegCommand.push("-b:a", `${audioBitrate}k`);
    }

    if (videoBitrate) {
      ffmpegCommand.push("-b:v", `${videoBitrate}k`);
    }

    if (framerate) {
      ffmpegCommand.push("-r", `${framerate}`);
    }

    if (resolution) {
      ffmpegCommand.push("-s", resolution.resolution);
    }

    ffmpegCommand.push("-f", container.container);

    ffmpegCommand.push("-crf", `${config.crf}`);
    ffmpegCommand.push("-movflags", "faststart");
    ffmpegCommand.push("-threads", "0");

    let outputPath = `${inputPath.split(".")[0]}_${
      resolution.label
    }_${videoCodec.label.replace(".", "")}_${audioCodec.label.replace(
      ".",
      ""
    )}.${container.container}`;

    // change folder
    outputPath = outputPath.replace("videos", "processed");

    ffmpegCommand.push(`${outputPath}`);

    logger.info(ffmpegCommand.join(" "), "ffmpeg command");

    const ffmpeg = spawn("ffmpeg", ffmpegCommand);

    ffmpeg.stdout.on("data", (data) => {
      logger.trace(`ffmpeg stdout: ${data}`);
    });
    ffmpeg.stderr.on("data", (data) => {
      logger.trace(`ffmpeg stderr: ${data}`);
    });
    ffmpeg.on("close", (code) => {
      logger.info(`child process exited with code ${code}`);
      if (code === 0) {
        resolve({
          success: true,
          outputPath,
        });
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on("error", (err) => {
      logger.error(err);
    });
  });
}

export default processVideo;

// const ffmpeg = spawn(
//     "ffmpeg",
//     [
//       "-i",
//       inputPath,
//       "-c:v",
//       "libx264",
//       "-crf",
//       "23",
//       "-f",
//       "mkv",
//       outputPath,
//     ],
//     {
//       signal,
//     }
//   );
