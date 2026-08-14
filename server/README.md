# PedallUp FastAPI server

## 환경 설정

```powershell
cd server
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

`.env`에 실제 MySQL 접속 정보를 설정하세요. 서버 시작 시 데이터베이스와
`members` 테이블이 없으면 자동으로 생성됩니다.

```env
DB_USER=root
DB_PASSWORD=password
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=bicycle
JWT_SECRET_KEY=32바이트-이상의-랜덤한-비밀키
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

비밀번호에 `@`, `:`, `/` 같은 예약 문자가 있다면 URL 인코딩해야 합니다.

## 실행

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

- Swagger UI: `http://127.0.0.1:8000/docs`
- 회원가입: `POST /api/member/signup`
- 로그인: `POST /api/member/login`
