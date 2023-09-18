FROM google/shaka-packager:release-v2.4.3 as packager
FROM mwader/static-ffmpeg as ffmpeg

FROM node:18-slim AS base


ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


WORKDIR /app

COPY package.json pnpm-lock.yaml ./
ENV NODE_ENV=development
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prefer-frozen-lockfile

CMD ["pnpm", "dev"]

COPY --from=packager /usr/bin /usr/local/bin/
COPY --from=ffmpeg /ffmpeg /usr/local/bin/
COPY --from=ffmpeg /ffprobe /usr/local/bin/

EXPOSE 5000