# Stage 1: Build a Go application
FROM golang:1.24.4-alpine AS builder

# ตั้งค่า WORKDIR ภายใน container
WORKDIR /app

# Copy go.mod และ go.sum เพื่อ cache dependencies
COPY go.mod go.sum ./

# ดาวน์โหลด dependencies ก่อนที่จะ copy source code เพื่อใช้ Docker layer caching
RUN go mod download

# Copy source code ทั้งหมด
COPY . .

# Build application
# ใช้ CGO_ENABLED=0 เพื่อสร้าง static binary ที่ไม่ขึ้นกับไลบรารีของระบบ
RUN CGO_ENABLED=0 go build -o main .

# Stage 2: Create a minimal image for running the application
FROM alpine:latest

# ตั้งค่า WORKDIR ภายใน container
WORKDIR /app

# Copy binary file จาก builder stage
COPY --from=builder /app/main .

# Expose port ที่ application ใช้
EXPOSE 8000

# Run the application
CMD ["./main"]