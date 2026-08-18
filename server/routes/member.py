from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from core.security import create_access_token, hash_password, verify_password
from database.connection import get_db
from models.member import MemberModel
from schemas.member import LoginItem, LoginResponse, MemberCreate, MemberResponse


router = APIRouter(tags=["member"])


@router.post("/signup", response_model=MemberResponse, status_code=status.HTTP_201_CREATED)
def signup(item: MemberCreate, db: Session = Depends(get_db)) -> MemberModel:
    duplicate = db.scalar(
        select(MemberModel).where(
            or_(
                MemberModel.id == item.id,
                MemberModel.email == item.email,
                MemberModel.phone == item.phone,
            )
        )
    )
    if duplicate:
        raise HTTPException(
            status_code=409,
            detail="이미 사용 중인 아이디, 이메일 또는 전화번호입니다.",
        )

    member = MemberModel(
        id=item.id,
        pwd=hash_password(item.pwd),
        name=item.name,
        phone=item.phone,
        email=item.email,
        role="USER",
    )
    db.add(member)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="이미 등록된 회원 정보입니다.") from None
    db.refresh(member)
    return member


@router.post("/login", response_model=LoginResponse)
def login(item: LoginItem, db: Session = Depends(get_db)) -> LoginResponse:
    member = db.scalar(select(MemberModel).where(MemberModel.id == item.id))
    if member is None or not verify_password(item.pwd, member.pwd):
        return LoginResponse(isLogin=False)

    access_token = create_access_token(subject=member.id, role=member.role)
    return LoginResponse(
        isLogin=True,
        role=member.role,
        name=member.name,
        accessToken=access_token,
    )
