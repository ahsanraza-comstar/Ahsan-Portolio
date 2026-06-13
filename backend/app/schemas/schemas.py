from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, EmailStr


# ── Auth ───────────────────────────────────────────────────────────────────────
class CredentialsUpdate(BaseModel):
    current_password: str
    new_email: Optional[str] = None
    new_password: Optional[str] = None


# ── About ──────────────────────────────────────────────────────────────────────
class AboutBase(BaseModel):
    name: str
    tagline: Optional[str] = ""
    bio: Optional[str] = ""
    avatar_url: Optional[str] = ""
    resume_url: Optional[str] = ""
    location: Optional[str] = ""
    years_experience: Optional[int] = 0
    projects_count: Optional[int] = 1
    ai_models_count: Optional[int] = 20
    certifications_count: Optional[int] = 0
    client_satisfaction:  Optional[int] = 99
    email: Optional[str] = ""
    github_url: Optional[str] = ""
    linkedin_url: Optional[str] = ""
    twitter_url: Optional[str] = ""


class AboutCreate(AboutBase):
    pass


class AboutUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    resume_url: Optional[str] = None
    location: Optional[str] = None
    years_experience: Optional[int] = None
    projects_count: Optional[int] = None
    ai_models_count: Optional[int] = None
    certifications_count: Optional[int] = None
    client_satisfaction:  Optional[int] = None
    email: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None


class AboutOut(AboutBase):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Service ────────────────────────────────────────────────────────────────────
class ServiceBase(BaseModel):
    title: str
    description: Optional[str] = ""
    icon: Optional[str] = ""
    accent_color: Optional[str] = "amber"
    order: Optional[int] = 0
    is_active: Optional[bool] = True


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(ServiceBase):
    title: Optional[str] = None


class ServiceOut(ServiceBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Skill ──────────────────────────────────────────────────────────────────────
class SkillBase(BaseModel):
    name: str
    category: Optional[str] = "ML/AI"
    proficiency: Optional[int] = 80
    icon_url: Optional[str] = ""
    order: Optional[int] = 0


class SkillCreate(SkillBase):
    pass


class SkillUpdate(SkillBase):
    name: Optional[str] = None


class SkillOut(SkillBase):
    id: int

    class Config:
        from_attributes = True


# ── Certification ──────────────────────────────────────────────────────────────
class CertificationBase(BaseModel):
    title: str
    issuer: Optional[str] = ""
    issued_date: Optional[date] = None
    expiry_date: Optional[date] = None
    credential_url: Optional[str] = ""
    badge_url: Optional[str] = ""
    description: Optional[str] = ""


class CertificationCreate(CertificationBase):
    pass


class CertificationUpdate(CertificationBase):
    title: Optional[str] = None


class CertificationOut(CertificationBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Project ────────────────────────────────────────────────────────────────────
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = ""
    long_description: Optional[str] = ""
    thumbnail_url: Optional[str] = ""
    images: Optional[List[str]] = []
    demo_url: Optional[str] = ""
    repo_url: Optional[str] = ""
    tech_stack: Optional[List[str]] = []
    category: Optional[str] = "AI/ML"
    is_featured: Optional[bool] = False
    order: Optional[int] = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    title: Optional[str] = None


class ProjectOut(ProjectBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Contact ────────────────────────────────────────────────────────────────────
class ContactCreate(BaseModel):
    name: str
    email: str
    subject: Optional[str] = ""
    message: str


class ContactOut(ContactCreate):
    id: int
    is_read: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Auth ───────────────────────────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# ── Experience ─────────────────────────────────────────────────────────────────
class ExperienceBase(BaseModel):
    title: str
    company: Optional[str] = ""
    location: Optional[str] = ""
    start_date: Optional[str] = ""
    end_date: Optional[str] = ""
    description: Optional[str] = ""
    type: Optional[str] = "work"
    is_current: Optional[bool] = False
    order: Optional[int] = 0

class ExperienceCreate(ExperienceBase): pass
class ExperienceUpdate(ExperienceBase):
    title: Optional[str] = None
class ExperienceOut(ExperienceBase):
    id: int
    created_at: Optional[datetime] = None
    class Config: from_attributes = True


# ── Testimonial ────────────────────────────────────────────────────────────────
class TestimonialBase(BaseModel):
    name: str
    role: Optional[str] = ""
    company: Optional[str] = ""
    avatar_url: Optional[str] = ""
    content: Optional[str] = ""
    rating: Optional[float] = 5
    order: Optional[int] = 0
    is_active: Optional[bool] = True

class TestimonialCreate(TestimonialBase): pass
class TestimonialUpdate(TestimonialBase):
    name: Optional[str] = None
class TestimonialOut(TestimonialBase):
    id: int
    created_at: Optional[datetime] = None
    class Config: from_attributes = True


# ── Article ────────────────────────────────────────────────────────────────────
class ArticleBase(BaseModel):
    title: str
    slug: Optional[str] = ""
    excerpt: Optional[str] = ""
    content: Optional[str] = ""
    thumbnail_url: Optional[str] = ""
    tags: Optional[List[str]] = []
    is_published: Optional[bool] = False
    published_at: Optional[datetime] = None

class ArticleCreate(ArticleBase): pass
class ArticleUpdate(ArticleBase):
    title: Optional[str] = None
class ArticleOut(ArticleBase):
    id: int
    created_at: Optional[datetime] = None
    class Config: from_attributes = True
