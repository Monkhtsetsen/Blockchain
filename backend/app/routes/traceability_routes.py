from datetime import datetime

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Product, TraceEvent, MockBlockchain
from ..schemas import TraceEventCreateRequest
from ..auth import get_current_user
from ..security import require_roles
from ..blockchain import (
    generate_data_hash,
    generate_transaction_hash,
    verify_event_hash,
)
from ..audit import create_audit_log

router = APIRouter(prefix="/traceability", tags=["Traceability"])


def build_event_data(event: TraceEvent) -> dict:
    return {
        "product_id": event.product_id,
        "event_type": event.event_type,
        "description": event.description,
        "location": event.location,
        "temperature": float(event.temperature) if event.temperature is not None else None,
        "event_time": event.event_time,
        "created_by": event.created_by,
    }


@router.post("/events")
def create_trace_event(
    payload: TraceEventCreateRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_roles(
        current_user,
        ["admin", "farmer", "processor", "transporter"],
    )

    product = (
        db.query(Product)
        .filter(Product.product_code == payload.product_code)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    if payload.event_time.replace(tzinfo=None) > datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="Ирээдүйн огноо оруулж болохгүй",
        )

    event = TraceEvent(
        product_id=product.id,
        event_type=payload.event_type,
        description=payload.description,
        location=payload.location,
        temperature=payload.temperature,
        event_time=payload.event_time.replace(tzinfo=None),
        created_by=current_user.id,
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    last_block = db.query(MockBlockchain).order_by(MockBlockchain.id.desc()).first()
    previous_hash = last_block.transaction_hash if last_block else None

    event_data = build_event_data(event)
    data_hash = generate_data_hash(event_data)
    transaction_hash = generate_transaction_hash(data_hash, previous_hash)

    block = MockBlockchain(
        event_id=event.id,
        transaction_hash=transaction_hash,
        previous_hash=previous_hash,
        data_hash=data_hash,
        verified_status=True,
    )

    db.add(block)
    db.commit()
    db.refresh(block)

    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="CREATE_TRACE_EVENT",
        endpoint="/traceability/events",
        ip_address=request.client.host if request.client else None,
    )

    return {
        "message": "Trace event created successfully",
        "event_id": event.id,
        "transaction_hash": block.transaction_hash,
        "previous_hash": block.previous_hash,
        "data_hash": block.data_hash,
        "verified_status": block.verified_status,
    }


@router.get("/{product_code}")
def get_product_trace(
    product_code: str,
    db: Session = Depends(get_db),
):
    product = (
        db.query(Product)
        .filter(Product.product_code == product_code)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    events = (
        db.query(TraceEvent)
        .filter(TraceEvent.product_id == product.id)
        .order_by(TraceEvent.event_time.asc())
        .all()
    )

    result = []

    for event in events:
        block = (
            db.query(MockBlockchain)
            .filter(MockBlockchain.event_id == event.id)
            .first()
        )

        event_data = build_event_data(event)

        is_verified = False

        if block:
            is_verified = verify_event_hash(block.data_hash, event_data)
            block.verified_status = is_verified
            db.commit()

        result.append(
            {
                "event_id": event.id,
                "event_type": event.event_type,
                "description": event.description,
                "location": event.location,
                "temperature": float(event.temperature)
                if event.temperature is not None
                else None,
                "event_time": event.event_time,
                "transaction_hash": block.transaction_hash if block else None,
                "previous_hash": block.previous_hash if block else None,
                "verified_status": is_verified,
            }
        )

    return {
        "product": {
            "product_code": product.product_code,
            "name": product.name,
            "animal_type": product.animal_type,
            "origin_location": product.origin_location,
            "qr_code": product.qr_code,
        },
        "trace_events": result,
    }