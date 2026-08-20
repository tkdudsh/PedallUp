# 대여소 도움 챗봇

## 환경변수

`server/.env`에 OpenAI 설정을 추가합니다.

```env
OPENAI_API_KEY=발급받은_API_KEY
OPENAI_MODEL=gpt-5.4-mini
```

## API

모든 챗봇 API는 로그인 후 받은 Bearer JWT가 필요합니다.

- `POST /api/chat`: 대여소 질문, 최근 대화 문맥 및 답변

채팅 기록은 DB에 저장하지 않습니다. 로그인 중 React 메모리에만 보관하고 각
요청의 `history` 필드로 FastAPI에 전달하며, 로그아웃하면 즉시 초기화됩니다.

현재 대여소 DB에는 실시간 자전거 수가 아니라 설치된 거치대 수가 저장되어
있습니다. 챗봇은 해당 차이를 명시하고 DB에 없는 실시간 수치를 추측하지 않습니다.
