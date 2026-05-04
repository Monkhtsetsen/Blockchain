from fastapi import HTTPException, status


def require_roles(current_user, allowed_roles: list[str]):
    if current_user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Танд энэ үйлдлийг хийх эрх байхгүй байна",
        )