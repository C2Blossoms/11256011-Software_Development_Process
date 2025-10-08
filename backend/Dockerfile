# Stage 1: Build a Go application
FROM golang:1.25-alpine AS backend-builder

# ตั้งค่า WORKDIR ภายใน container
WORKDIR /app

RUN apk add --no-cache git

# Copy go.mod และ go.sum เพื่อ cache dependencies
COPY go.mod go.sum ./

# ดาวน์โหลด dependencies ก่อนที่จะ copy source code เพื่อใช้ Docker layer caching
RUN go mod download

# Copy source code ทั้งหมด
COPY . .

# สร้าง binary แบบ static 
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64

RUN go build -o /out/ecom-api ./

# Stage 2: Runtime
FROM alpine:latest

# ตั้งค่า WORKDIR ภายใน container
WORKDIR /srv/ecom-api

# ใส่ zoneifo เผื่อใช้ time zone
RUN apk add --no-cache ca-certificates

# เพิ่ม user ธรรมดาเพื่อความปลอดภัย
RUN addgroup -S app && adduser -S app -G app
USER app

# Copy binary file จาก builder stage
COPY --from=backend-builder /out/ecom-api ./ecom-api

# Expose port ที่ application ใช้
EXPOSE 8000

# Container รับค่าผ่าน ENV จาก compose
ENTRYPOINT [ "/srv/ecom-api/ecom-api" ]