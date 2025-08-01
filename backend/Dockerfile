# ใช้ base image ของ Go
FROM golang:1.20-alpine

# กำหนด directory ใน container
WORKDIR /app

# copy go.mod และ go.sum
COPY go.mod go.sum ./

# ดาวน์โหลด dependencies
RUN go mod download

# copy ไฟล์โค้ดทั้งหมด
COPY . .

# build binary
RUN go build -o main .

# expose port
EXPOSE 8000

# run binary
CMD ["./main"]