from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, Literal


UserRole = Literal["admin", "farmer", "processor", "transporter", "consumer"]

EventType = Literal[
    "FARM_REGISTERED",
    "SLAUGHTERED",
    "PROCESSED",
    "TRANSPORTED",
    "STORED",
]


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=4)
    role: UserRole


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=4)


class ProductCreateRequest(BaseModel):
    product_code: str = Field(..., min_length=2)
    name: str = Field(..., min_length=2)
    animal_type: Optional[str] = None
    origin_location: Optional[str] = None


class TraceEventCreateRequest(BaseModel):
    product_code: str = Field(..., min_length=2)
    event_type: EventType
    description: Optional[str] = None
    location: Optional[str] = None
    temperature: Optional[float] = None
    event_time: datetime