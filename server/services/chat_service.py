import os

from openai import APIConnectionError, APIStatusError, OpenAI, RateLimitError
from sqlalchemy.orm import Session

from repositories.station_repository import StationRepository
from schemas.chat import ChatHistoryItem


class ChatConfigurationError(RuntimeError):
    pass


class ChatProviderError(RuntimeError):
    pass


class ChatService:
    """대여소 컨텍스트 구성, OpenAI 호출, 대화 저장을 조율합니다."""

    def __init__(
        self,
        station_repository: StationRepository | None = None,
    ) -> None:
        self.station_repository = station_repository or StationRepository()
        self.model = os.getenv("OPENAI_MODEL", "gpt-5.4-mini")

    def _get_client(self) -> OpenAI:
        api_key = os.getenv("OPENAI_API_KEY", "").strip()
        if not api_key:
            raise ChatConfigurationError("OPENAI_API_KEY가 설정되지 않았습니다.")
        return OpenAI(api_key=api_key)

    def _build_station_context(self, db: Session) -> str:
        stations = self.station_repository.list_all(db)
        if not stations:
            return "현재 DB에 등록된 대여소가 없습니다."

        lines = []
        for station in stations:
            lines.append(
                " | ".join(
                    [
                        f"ID={station.station_id}",
                        f"대여소={station.station_name}",
                        f"자치구={station.district}",
                        f"주소={station.address}",
                        f"거치대={station.rack_count}대",
                        f"운영방식={station.operation_type}",
                    ]
                )
            )
        return "\n".join(lines)

    def answer(
        self,
        db: Session,
        question: str,
        history: list[ChatHistoryItem],
    ) -> str:
        """프론트가 전달한 대화와 최신 대여소 DB 내용을 OpenAI에 전달합니다."""
        station_context = self._build_station_context(db)

        input_messages = [
            {"role": message.role, "content": message.content}
            for message in history[-20:]
        ]
        input_messages.append({"role": "user", "content": question.strip()})

        instructions = f"""
너는 PEDALLUP의 서울 따릉이 대여소 도움 챗봇이다.
한국어로 간결하고 친절하게 답변한다.
아래 DB 데이터만 대여소 사실의 근거로 사용하고, 없는 값은 추측하지 않는다.
현재 DB의 수치는 실제 대여 가능한 자전거 수가 아니라 설치된 거치대 수다.
사용자가 현재 자전거 수를 물으면 실시간 자전거 수는 제공되지 않는다고 명확히 말하고,
대신 해당 대여소의 거치대 수와 주소를 안내한다.
자전거와 대여소에서 벗어난 질문에는 서비스 범위를 짧게 안내한다.

[대여소 DB]
{station_context}
""".strip()

        try:
            response = self._get_client().responses.create(
                model=self.model,
                instructions=instructions,
                input=input_messages,
                max_output_tokens=500,
            )
        except RateLimitError as exc:
            raise ChatProviderError("OpenAI API 사용량 한도를 확인해 주세요.") from exc
        except APIConnectionError as exc:
            raise ChatProviderError("OpenAI API에 연결할 수 없습니다.") from exc
        except APIStatusError as exc:
            raise ChatProviderError("OpenAI API 요청 처리에 실패했습니다.") from exc

        answer = response.output_text.strip()
        if not answer:
            raise ChatProviderError("OpenAI가 빈 응답을 반환했습니다.")

        return answer
