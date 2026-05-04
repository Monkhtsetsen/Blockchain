from .models import AuditLog


def create_audit_log(db, user_id, action, endpoint, ip_address):
    log = AuditLog(
        user_id=user_id,
        action=action,
        endpoint=endpoint,
        ip_address=ip_address,
    )

    db.add(log)
    db.commit()