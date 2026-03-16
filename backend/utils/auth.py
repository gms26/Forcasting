from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import jwt
import os
from datetime import datetime, timedelta

router = APIRouter()

# Constants for JWT
SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key-for-smartforecast")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

# Demo credentials for interview/test purposes
DEMO_USER = {
    "username": "admin",
    "password": "admin123"
}

class UserLogin(BaseModel):
    username: str
    password: str

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login")
def login_user(user: UserLogin):
    """
    Simple login function that checks against demo credentials.
    Returns a JWT token on success.
    """
    if user.username == DEMO_USER["username"] and user.password == DEMO_USER["password"]:
        access_token = create_access_token(data={"sub": user.username})
        return {
            "access_token": access_token, 
            "token_type": "bearer", 
            "username": user.username,
            "message": "Login successful"
        }
    
    raise HTTPException(
        status_code=401, 
        detail="Invalid username or password"
    )

# Keeping register endpoint for potential future use, but making it non-functional for demo
@router.post("/register")
def register_user():
    raise HTTPException(
        status_code=403,
        detail="Registration is disabled for this demo version. Use admin/admin123."
    )
