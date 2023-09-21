import pino from "pino";
import { z } from "zod";
import { isDev } from "./constants";
import { join } from "path";

const opts: pino.LoggerOptions = {
  level: isDev ? "trace" : "info",

  transport: {
    targets: [
      {
        level: "trace",
        target: "pino-pretty",
        options: {},
      },
      {
        // file
        level: "trace",
        target: "pino/file",
        options: {
          destination: `${join(__dirname, "..", "..", "logs")}/app.log`,
        },
      },
    ],
  },
  formatters: {
    bindings(bindings) {
      return {};
    },
  },
};
export const logger = pino(opts);
export const levelSchema = z.enum([
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
  "silent",
]);
