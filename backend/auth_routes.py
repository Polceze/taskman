from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from auth import verify_password, create_access_token, get_current_user
import crud
import models

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new account",
)
def register(data: UserRegister, db: Session = Depends(get_db)):
    """
    Create a new user account. Returns a JWT token immediately
    so the user is logged in right after registering.
    """
    # Prevent duplicate accounts
    if crud.get_user_by_email(db, data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = crud.create_user(db, data)
    token = create_access_token(user.id, user.email)

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Log in to an existing account",
)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate with email and password. Returns a JWT token on success.
    Deliberately vague error message to avoid revealing whether an email exists.
    """
    user = crud.get_user_by_email(db, data.email)

    # Use constant-time comparison — don't short-circuit on missing user
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    token = create_access_token(user.id, user.email)

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current logged-in user",
)
def me(current_user: models.User = Depends(get_current_user)):
    """Returns the profile of the currently authenticated user."""
    return current_user