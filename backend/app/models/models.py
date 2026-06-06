from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, JSON, Float
from app.core.database import Base


class About(Base):
    __tablename__ = "about"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, default="Ahsan Raza")
    tagline = Column(String, default="AI Engineer & Builder")
    bio = Column(Text, default="")
    avatar_url = Column(String, default="")
    resume_url = Column(String, default="")
    location = Column(String, default="")
    years_experience = Column(Integer, default=0)
    projects_count = Column(Integer, default=1)
    ai_models_count = Column(Integer, default=20)
    certifications_count = Column(Integer, default=0)
    client_satisfaction  = Column(Integer, default=99)
    email = Column(String, default="")
    github_url = Column(String, default="")
    linkedin_url = Column(String, default="")
    twitter_url = Column(String, default="")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    icon = Column(String, default="")
    accent_color = Column(String, default="amber")
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, default="ML/AI")
    proficiency = Column(Integer, default=80)
    icon_url = Column(String, default="")
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class Certification(Base):
    __tablename__ = "certifications"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    issuer = Column(String, default="")
    issued_date = Column(Date, nullable=True)
    expiry_date = Column(Date, nullable=True)
    credential_url = Column(String, default="")
    badge_url = Column(String, default="")
    description = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    long_description = Column(Text, default="")
    thumbnail_url = Column(String, default="")
    images = Column(JSON, default=list)
    demo_url = Column(String, default="")
    repo_url = Column(String, default="")
    tech_stack = Column(JSON, default=list)
    category = Column(String, default="AI/ML")
    is_featured = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="")
    email = Column(String, default="")
    subject = Column(String, default="")
    message = Column(Text, default="")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Experience(Base):
    __tablename__ = "experience"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company = Column(String, default="")
    location = Column(String, default="")
    start_date = Column(String, default="")
    end_date = Column(String, default="")
    description = Column(Text, default="")
    type = Column(String, default="work")   # "work" | "education"
    is_current = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class Testimonial(Base):
    __tablename__ = "testimonials"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, default="")
    company = Column(String, default="")
    avatar_url = Column(String, default="")
    content = Column(Text, default="")
    rating = Column(Integer, default=5)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Article(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, default="")
    excerpt = Column(Text, default="")
    content = Column(Text, default="")
    thumbnail_url = Column(String, default="")
    tags = Column(JSON, default=list)
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
