from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.dependencies import get_current_member
from database.connection import get_db
from models.member import MemberModel
from schemas.chat import (
    ChatRequest,
    ChatResponse,
)
from services.chat_service import (
    ChatConfigurationError,
    ChatProviderError,
    ChatService,
)


router = APIRouter(tags=["chat"])
chat_service = ChatService()


@router.post("", response_model=ChatResponse)
def send_message(
    item: ChatRequest,
    db: Session = Depends(get_db),
    _member: MemberModel = Depends(get_current_member),
) -> ChatResponse:
    """API 계층은 인증·요청 검증·HTTP 오류 변환만 담당합니다."""
    try:
        answer = chat_service.answer(db, item.message, item.history)
    except ChatConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ChatProviderError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return ChatResponse(answer=answer)
