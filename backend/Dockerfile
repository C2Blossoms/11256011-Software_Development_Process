# syntax=docker/dockerfile:1.7-labs
# ปล่อยให้ tag เดิมในไฟล์คุณคงอยู่ได้ ถ้าอยาก pin: ARG GO_VERSION=1.25.3
FROM golang:1.25-alpine AS build
WORKDIR /src
RUN apk add --no-cache git ca-certificates tzdata

# ใช้ cache ของ BuildKit ให้เร็ว
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download

COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /app/app .

# runtime เล็กและปลอดภัย (อยากคง alpine ก็ได้)
FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY --from=build /app/app /app/app
ENV PORT=8000
EXPOSE 8000
USER 10001
ENTRYPOINT ["/app/app"]
