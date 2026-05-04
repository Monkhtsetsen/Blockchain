from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
    Boolean,
    DECIMAL,
    Enum,
)
from sqlalchemy.sql import func

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(
        Enum("admin", "farmer", "processor", "transporter", "consumer"),
        nullable=False,
    )
    created_at = Column(DateTime, server_default=func.now())


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_code = Column(String(100), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    animal_type = Column(String(100))
    origin_location = Column(String(150))
    qr_code = Column(String(255))
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())


class TraceEvent(Base):
    __tablename__ = "trace_events"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    event_type = Column(
        Enum(
            "FARM_REGISTERED",
            "SLAUGHTERED",
            "PROCESSED",
            "TRANSPORTED",
            "STORED",
        ),
        nullable=False,
    )
    description = Column(Text)
    location = Column(String(150))
    temperature = Column(DECIMAL(5, 2))
    event_time = Column(DateTime, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())


class MockBlockchain(Base):
    __tablename__ = "mock_blockchain"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("trace_events.id"), nullable=False)
    transaction_hash = Column(String(255), nullable=False)
    previous_hash = Column(String(255))
    data_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    verified_status = Column(Boolean, default=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(150), nullable=False)
    endpoint = Column(String(255))
    ip_address = Column(String(100))
    created_at = Column(DateTime, server_default=func.now())