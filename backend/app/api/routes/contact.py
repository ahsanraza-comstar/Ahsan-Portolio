from fastapi import APIRouter, Depends, BackgroundTasks, Request
from sqlalchemy.orm import Session
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.database import get_db
from app.core.config import settings
from app.api.deps import get_current_admin
from app.crud import create_contact_message, get_contact_messages, mark_message_read, delete_message
from app.schemas.schemas import ContactCreate, ContactOut
from typing import List
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter(tags=["contact"])
limiter = Limiter(key_func=get_remote_address)


def _send_notification(name: str, email: str, subject: str, message: str):
    """Send email notification to admin when a contact message arrives."""
    if not settings.MAIL_USERNAME or not settings.MAIL_FROM:
        return  # SMTP not configured — skip silently

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[Portfolio] New message: {subject}"
        msg["From"] = settings.MAIL_FROM
        msg["To"] = settings.ADMIN_EMAIL

        html = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#4ade80">New Contact Message</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;font-weight:bold;width:100px">From:</td>
                <td style="padding:8px">{name} &lt;{email}&gt;</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Subject:</td>
                <td style="padding:8px">{subject}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Message:</td>
                <td style="padding:8px;white-space:pre-wrap">{message}</td></tr>
          </table>
          <hr style="border-color:#333;margin-top:24px"/>
          <p style="color:#888;font-size:12px">Sent from your portfolio contact form</p>
        </div>
        """
        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT) as server:
            server.starttls()
            server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
            server.sendmail(settings.MAIL_FROM, settings.ADMIN_EMAIL, msg.as_string())
    except Exception as e:
        print(f"[Email] Failed to send notification: {e}")


@router.post("", response_model=ContactOut)
@limiter.limit("5/hour")
async def send_message(
    request: Request,
    data: ContactCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    msg = create_contact_message(db, data)
    background_tasks.add_task(
        _send_notification, data.name, data.email, data.subject, data.message
    )
    return msg


@router.get("", response_model=List[ContactOut], dependencies=[Depends(get_current_admin)])
async def list_messages(db: Session = Depends(get_db)):
    return get_contact_messages(db)


@router.put("/{msg_id}/read", response_model=ContactOut, dependencies=[Depends(get_current_admin)])
async def read_message(msg_id: int, db: Session = Depends(get_db)):
    return mark_message_read(db, msg_id)


@router.delete("/{msg_id}", dependencies=[Depends(get_current_admin)])
async def remove_message(msg_id: int, db: Session = Depends(get_db)):
    delete_message(db, msg_id)
    return {"ok": True}
