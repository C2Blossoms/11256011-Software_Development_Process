# Stage 1: Build ด้วย Go image
FROM golang:1.24.4 AS builder

WORKDIR /app
COPY . .
RUN go build -o main .

FROM phpmyadmin/phpmyadmin
COPY config.inc.php /etc/phpmyadmin/config.inc.php
RUN apt update && apt install -y nano

# Stage 2: Run ด้วย image เล็ก
FROM debian:bullseye-slim
WORKDIR /app
COPY --from=builder /app/main .

CMD ["./main"]