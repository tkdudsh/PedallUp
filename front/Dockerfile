FROM node:22-alpine

WORKDIR /app

# lock 파일을 기준으로 동일한 버전의 패키지를 설치합니다.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# 브라우저에서 호출할 FastAPI 주소입니다.
ENV VITE_API_URL=http://localhost:8000/api

EXPOSE 5173

# Nginx 없이 Vite 개발 서버를 컨테이너 외부에 공개합니다.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
