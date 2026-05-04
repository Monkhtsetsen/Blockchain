from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Product, TraceEvent, MockBlockchain
from ..blockchain import verify_event_hash

router = APIRouter(prefix="/public", tags=["Public Consumer"])


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


@router.get("/products/{product_code}")
def get_public_product_trace(
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
            detail="Бүтээгдэхүүн олдсонгүй",
        )

    events = (
        db.query(TraceEvent)
        .filter(TraceEvent.product_id == product.id)
        .order_by(TraceEvent.event_time.asc())
        .all()
    )

    public_events = []
    verified_count = 0

    for event in events:
        block = (
            db.query(MockBlockchain)
            .filter(MockBlockchain.event_id == event.id)
            .first()
        )

        is_verified = False

        if block:
            event_data = build_event_data(event)
            is_verified = verify_event_hash(block.data_hash, event_data)

        if is_verified:
            verified_count += 1

        public_events.append(
            {
                "event_type": event.event_type,
                "description": event.description,
                "location": event.location,
                "temperature": float(event.temperature)
                if event.temperature is not None
                else None,
                "event_time": event.event_time,
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
        "verification": {
            "status": "VERIFIED"
            if len(events) > 0 and verified_count == len(events)
            else "NEEDS_REVIEW",
            "verified_events": verified_count,
            "total_events": len(events),
        },
        "traceability_history": public_events,
    }