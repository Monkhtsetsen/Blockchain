from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Product
from ..schemas import ProductCreateRequest
from ..auth import get_current_user
from ..security import require_roles
from ..audit import create_audit_log

router = APIRouter(prefix="/products", tags=["Products"])


@router.post("/")
def create_product(
    payload: ProductCreateRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_roles(current_user, ["admin", "farmer"])

    existing_product = (
        db.query(Product)
        .filter(Product.product_code == payload.product_code)
        .first()
    )

    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="Product code already exists",
        )

    product = Product(
        product_code=payload.product_code,
        name=payload.name,
        animal_type=payload.animal_type,
        origin_location=payload.origin_location,
        qr_code=f"QR-{payload.product_code}",
        created_by=current_user.id,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="CREATE_PRODUCT",
        endpoint="/products",
        ip_address=request.client.host if request.client else None,
    )

    return {
        "message": "Product created successfully",
        "product": {
            "id": product.id,
            "product_code": product.product_code,
            "name": product.name,
            "animal_type": product.animal_type,
            "origin_location": product.origin_location,
            "qr_code": product.qr_code,
        },
    }


@router.get("/")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).order_by(Product.created_at.desc()).all()

    return [
        {
            "id": product.id,
            "product_code": product.product_code,
            "name": product.name,
            "animal_type": product.animal_type,
            "origin_location": product.origin_location,
            "qr_code": product.qr_code,
            "created_at": product.created_at,
        }
        for product in products
    ]