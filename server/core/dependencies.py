from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from core.security import decode_access_token
from database.connection import get_db
from models.member import MemberModel


bearer_scheme = HTTPBearer(auto_error=False)


def get_current_member(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> MemberModel:
    """Bearer JWT를 검증하고 현재 로그인 회원을 DB에서 조회합니다."""
    payload = decode_access_token(credentials.credentials) if credentials else None
    member_id = payload.get("sub") if payload else None
    member = db.get(MemberModel, member_id) if member_id else None
    if member is None:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")
    return member
