from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.models import User
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Auth"])

class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str
    age: Optional[int] = None
    gender: Optional[str] = None

class LoginIn(BaseModel):
    email: EmailStr
    password: str

@router.post("/register", status_code=201)
async def register(data: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(name=data.name, email=data.email,
                password_hash=hash_password(data.password),
                age=data.age, gender=data.gender)
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.user_id)})
    return {
        "token": token,
        "user": {"id": str(user.user_id), "name": user.name, "email": user.email}
    }

@router.post("/login")
async def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token({"sub": str(user.user_id)})
    return {
        "token": token,
        "user": {"id": str(user.user_id), "name": user.name, "email": user.email}
    }
