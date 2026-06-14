FROM oven/bun:alpine AS builder

WORKDIR /usr/src/app

COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile

COPY frontend/ ./
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN bun run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
