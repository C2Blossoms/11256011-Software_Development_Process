# ---------- Build stage ----------
FROM node:20-alpine AS frontend-build
WORKDIR /app

# รับ environment variable ตอน build
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Runtime (Next.js server) ----------
FROM node:20-alpine AS frontend-runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# ติดตั้งเฉพาะ prod deps
COPY package*.json ./
RUN npm ci --omit=dev

# คัดลอกผล build + ไฟล์สาธารณะ
COPY --from=frontend-build /app/.next ./.next
COPY --from=frontend-build /app/public ./public

EXPOSE 3000
CMD ["npm", "run", "start"]