import hashlib
import json
from datetime import datetime


def generate_data_hash(data: dict) -> str:
    """
    Event-ийн өгөгдлөөс SHA256 hash үүсгэнэ.
    Өгөгдөл өөрчлөгдвөл hash өөр болно.
    """
    data_string = json.dumps(data, sort_keys=True, default=str)
    return hashlib.sha256(data_string.encode("utf-8")).hexdigest()


def generate_transaction_hash(data_hash: str, previous_hash: str | None) -> str:
    """
    Mock blockchain transaction hash.
    previous_hash оролцож байгаа тул chain маягаар холбогдоно.
    """
    raw = f"{data_hash}|{previous_hash}|{datetime.utcnow()}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def verify_event_hash(original_hash: str, current_data: dict) -> bool:
    current_hash = generate_data_hash(current_data)
    return original_hash == current_hash