"use client";

import { VideoMetadata } from "@/@types/video-metadata";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

async function fetchMetaData(
  sourceURL: string,
  processedURL: string,
  signal: AbortSignal
) {
  const fetchSource = fetch(sourceURL, {
    signal,
  });
  const fetchProcessed = fetch(processedURL, {
    signal,
  });

  const [sourceResponse, processedResponse] = await Promise.all([
    fetchSource,
    fetchProcessed,
  ]);
  if (!sourceResponse.ok) {
    throw new Error(sourceResponse.statusText);
  }
  if (!processedResponse.ok) {
    throw new Error(processedResponse.statusText);
  }
  const [sourceMeta, processedMeta] = await Promise.all([
    sourceResponse.json(),
    processedResponse.json(),
  ]);
  return { sourceMeta, processedMeta };
}

export default function VideoMeta({
  metaURL,
  processedMetaURL,
}: {
  metaURL: string;
  processedMetaURL: string;
}) {
  const [sourceMeta, setSourceMeta] = useState<VideoMetadata>();
  const [processedMeta, setProcessedMeta] = useState<VideoMetadata>();
  useEffect(() => {
    if (!metaURL) return;
    const abortController = new AbortController();
    const { signal } = abortController;
    fetchMetaData(metaURL, processedMetaURL, signal)
      .then((meta) => {
        setSourceMeta(meta.sourceMeta);
        setProcessedMeta(meta.processedMeta);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      abortController.abort();
    };
  }, [metaURL, processedMetaURL]);
  return (
    <div className="border flex-grow rounded">
      {sourceMeta && processedMeta && (
        <ViewMeta sourceMeta={sourceMeta} processedMeta={processedMeta} />
      )}
    </div>
  );
}

function ViewMeta({
  sourceMeta,
  processedMeta,
}: {
  sourceMeta: VideoMetadata;
  processedMeta: VideoMetadata;
}) {
  const { streams, format } = sourceMeta;
  const { format_long_name, duration, bit_rate, size, filename, format_name } =
    format;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Processed</TableHead>
          <TableHead>Comparison</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>File Ext</TableCell>
          <TableCell>{filename.split(".").pop()}</TableCell>
          <TableCell>
            {processedMeta.format.filename.split(".").pop()}
          </TableCell>
          <TableCell>
            {filename.split(".").pop() ===
            processedMeta.format.filename.split(".").pop() ? (
              <span className="text-green-500">✓</span>
            ) : (
              <span className="text-red-500">✗</span>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Format</TableCell>
          <TableCell>{format_long_name}</TableCell>
          <TableCell>{processedMeta.format.format_long_name}</TableCell>
          <TableCell>
            {format_long_name === processedMeta.format.format_long_name ? (
              <span className="text-green-500">✓</span>
            ) : (
              <span className="text-red-500">✗</span>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Format name</TableCell>
          <TableCell>{format_name}</TableCell>
          <TableCell>{processedMeta.format.format_name}</TableCell>
          <TableCell>
            {format_name === processedMeta.format.format_name ? (
              <span className="text-green-500">✓</span>
            ) : (
              <span className="text-red-500">✗</span>
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Bitrate</TableCell>
          <TableCell>{bit_rate}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Size</TableCell>
          <TableCell>{BitsToMB(Number(size)).toFixed(4)} MB</TableCell>
          <TableCell>
            {BitsToMB(Number(processedMeta.format.size)).toFixed(4)} MB
          </TableCell>
          <TableCell>
            {(
              ((Number(size) - Number(processedMeta.format.size)) /
                Number(size)) *
              100
            ).toFixed(2)}
            %
          </TableCell>
        </TableRow>

        {streams.map((stream, i) => {
          return (
            <>
              <TableRow className="text-secondary">
                <TableCell>Index: {stream.index}</TableCell>
                <TableCell>
                  {stream.id} - {stream.codec_type} - {stream.codec_name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Stream bit rate</TableCell>
                <TableCell>{BitsToKB(Number(stream.bit_rate))} Kbps</TableCell>

                <TableCell>
                  {BitsToKB(Number(processedMeta.streams[i]?.bit_rate))} Kbps
                </TableCell>
                <TableCell>
                  {(
                    ((Number(stream.bit_rate) -
                      Number(processedMeta.streams[i]?.bit_rate)) /
                      Number(stream.bit_rate)) *
                    100
                  ).toFixed(2)}
                  %
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Codec</TableCell>
                <TableCell>{stream.codec_long_name}</TableCell>
                <TableCell>
                  {processedMeta.streams[i]?.codec_long_name}
                </TableCell>
                <TableCell>
                  {stream.codec_long_name ===
                  processedMeta.streams[i]?.codec_long_name ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span className="text-red-500">✗</span>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Codec Name</TableCell>
                <TableCell>{stream.codec_name}</TableCell>
                <TableCell>{processedMeta.streams[i]?.codec_name}</TableCell>
                <TableCell>
                  {stream.codec_name ===
                  processedMeta.streams[i]?.codec_name ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span className="text-red-500">✗</span>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Codec Type</TableCell>
                <TableCell>{stream.codec_type}</TableCell>
                <TableCell>{processedMeta.streams[i]?.codec_type}</TableCell>
                <TableCell>
                  {stream.codec_type ===
                  processedMeta.streams[i]?.codec_type ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span className="text-red-500">✗</span>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Display Aspect Ratio</TableCell>
                <TableCell>{stream.display_aspect_ratio}</TableCell>
                <TableCell>
                  {processedMeta.streams[i]?.display_aspect_ratio}
                </TableCell>
                <TableCell>
                  {stream.display_aspect_ratio ===
                  processedMeta.streams[i]?.display_aspect_ratio ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span className="text-red-500">✗</span>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Duration</TableCell>
                <TableCell>{stream.duration}</TableCell>
                <TableCell>{processedMeta.streams[i]?.duration}</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Duration TS</TableCell>
                <TableCell>{stream.duration_ts}</TableCell>
                <TableCell>{processedMeta.streams[i]?.duration_ts}</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Coded Height</TableCell>
                <TableCell>{stream.coded_height}</TableCell>
                <TableCell>{processedMeta.streams[i]?.coded_height}</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Coded Width</TableCell>
                <TableCell>{stream.coded_width}</TableCell>
                <TableCell>{processedMeta.streams[i]?.coded_width}</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Height</TableCell>
                <TableCell>{stream.height}</TableCell>
                <TableCell>{processedMeta.streams[i]?.height}</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Width</TableCell>
                <TableCell>{stream.width}</TableCell>
                <TableCell>{processedMeta.streams[i]?.width}</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pix Fmt</TableCell>
                <TableCell>{stream.pix_fmt}</TableCell>
                <TableCell>{processedMeta.streams[i]?.pix_fmt}</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Profile</TableCell>
                <TableCell>{stream.profile}</TableCell>
                <TableCell>{processedMeta.streams[i]?.profile}</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}

function BitsToKB(bits: number) {
  return bits / 1000;
}

function BitsToMB(bits: number) {
  return bits / 1000 / 1000;
}
