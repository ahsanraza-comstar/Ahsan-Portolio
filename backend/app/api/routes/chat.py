import json
import urllib.request
import urllib.error
from collections import defaultdict
from typing import List, Optional

from fastapi import APIRouter, Request, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.database import get_db
from app.core.config import settings
from app.models.models import About, Project, Skill, Experience, Certification, Service

router = APIRouter(tags=["chat"])
limiter = Limiter(key_func=get_remote_address)

SYSTEM_PROMPT = (
    "You are the friendly AI assistant on Ahsan Raza's personal portfolio website. "
    "Answer visitors' questions about Ahsan -- his skills, experience, projects, education, "
    "certifications and services -- using ONLY the information in the CONTEXT below. "
    "Be concise, warm and professional, and refer to him as 'Ahsan'. "
    "If a question is not covered by the context, say you don't have that detail and suggest "
    "using the contact form or emailing him. Never invent facts, links, numbers or projects. "
    "Keep replies under ~120 words unless asked for more detail, and use short paragraphs or "
    "bullet points when helpful.\n\nCONTEXT:\n{context}"
)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None


def build_context(db: Session) -> str:
    parts = []

    a = db.query(About).first()
    if a:
        about_lines = [
            f"Name: {a.name}",
            f"Role: {a.tagline}",
            f"Location: {a.location}",
            f"Years of experience: {a.years_experience}",
            f"Email: {a.email}",
            f"GitHub: {a.github_url}",
            f"LinkedIn: {a.linkedin_url}",
            f"Bio: {a.bio}",
        ]
        parts.append("## ABOUT\n" + "\n".join(x for x in about_lines if x.split(': ', 1)[-1]))

    projs = db.query(Project).order_by(Project.is_featured.desc(), Project.order).all()
    if projs:
        lines = ["## PROJECTS"]
        for p in projs:
            tech = ", ".join(p.tech_stack or [])
            lines.append(
                f"- {p.title} [{p.category}]: {p.description} "
                f"Tech: {tech}. Repo: {p.repo_url or 'n/a'}"
            )
        parts.append("\n".join(lines))

    skills = db.query(Skill).order_by(Skill.category, Skill.order).all()
    if skills:
        by = defaultdict(list)
        for s in skills:
            by[s.category].append(f"{s.name} ({int(s.proficiency)}%)")
        parts.append("## SKILLS\n" + "\n".join(f"{c}: {', '.join(v)}" for c, v in by.items()))

    exps = db.query(Experience).order_by(Experience.order).all()
    if exps:
        lines = ["## EXPERIENCE & EDUCATION"]
        for e in exps:
            period = (e.start_date or "")
            if e.is_current:
                period += " - Present"
            elif e.end_date:
                period += f" - {e.end_date}"
            lines.append(f"- [{e.type}] {e.title} @ {e.company} ({e.location}) {period}: {e.description}")
        parts.append("\n".join(lines))

    certs = db.query(Certification).all()
    if certs:
        parts.append("## CERTIFICATIONS\n" + "\n".join(f"- {c.title} ({c.issuer})" for c in certs))

    svcs = db.query(Service).filter(Service.is_active == True).all()  # noqa: E712
    if svcs:
        parts.append("## SERVICES\n" + "\n".join(f"- {s.title}: {s.description}" for s in svcs))

    return "\n\n".join(parts)


@router.post("")
@limiter.limit("15/minute")
async def chat(request: Request, body: ChatRequest, db: Session = Depends(get_db)):
    if not settings.NVIDIA_API_KEY:
        return {"answer": "The AI assistant isn't configured yet. In the meantime, feel free to use the contact form to reach Ahsan!"}

    msg = (body.message or "").strip()
    if not msg:
        raise HTTPException(status_code=400, detail="Empty message")
    msg = msg[:1000]

    messages = [{"role": "system", "content": SYSTEM_PROMPT.format(context=build_context(db))}]
    for m in (body.history or [])[-8:]:
        if m.role in ("user", "assistant") and m.content:
            messages.append({"role": m.role, "content": m.content[:2000]})
    messages.append({"role": "user", "content": msg})

    payload = {
        "model": settings.NVIDIA_MODEL,
        "messages": messages,
        "temperature": 0.3,
        "top_p": 0.9,
        "max_tokens": 600,
        "stream": False,
    }
    req = urllib.request.Request(
        settings.NVIDIA_BASE_URL.rstrip("/") + "/chat/completions",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {settings.NVIDIA_API_KEY}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            data = json.loads(r.read())
        answer = data["choices"][0]["message"]["content"].strip()
        return {"answer": answer}
    except urllib.error.HTTPError as e:
        print(f"[Chat] NVIDIA API error {e.code}: {e.read().decode()[:300]}")
        raise HTTPException(status_code=502, detail="The assistant is temporarily unavailable. Please try again.")
    except Exception as e:
        print(f"[Chat] error: {e}")
        raise HTTPException(status_code=502, detail="The assistant is temporarily unavailable. Please try again.")
