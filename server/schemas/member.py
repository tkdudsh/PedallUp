import re

from pydantic import BaseModel, ConfigDict, Field, field_validator


class LoginItem(BaseModel):
    id: str = Field(min_length=1, max_length=50)
    pwd: str = Field(min_length=1, max_length=128)


class MemberCreate(LoginItem):
    name: str = Field(min_length=1, max_length=50)
    phone: str = Field(min_length=8, max_length=20)
    email: str = Field(min_length=5, max_length=255)

    @field_validator("id", "name", "phone", "email", mode="before")
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip() if isinstance(value, str) else value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.lower()
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", value):
            raise ValueError("올바른 이메일 주소를 입력해 주세요.")
        return value


class MemberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    phone: str
    email: str
    role: str


class LoginResponse(BaseModel):
    isLogin: bool
    role: str | None = None
    accessToken: str | None = None

