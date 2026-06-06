from sqlalchemy.orm import Session
from app.models.models import About, Service, Skill, Certification, Project, ContactMessage, Experience, Testimonial, Article
from app.schemas.schemas import (
    AboutCreate, AboutUpdate,
    ServiceCreate, ServiceUpdate,
    SkillCreate, SkillUpdate,
    CertificationCreate, CertificationUpdate,
    ProjectCreate, ProjectUpdate,
    ContactCreate,
    ExperienceCreate, ExperienceUpdate,
    TestimonialCreate, TestimonialUpdate,
    ArticleCreate, ArticleUpdate,
)


# ── About (single-row upsert) ──────────────────────────────────────────────────
def get_about(db: Session):
    return db.query(About).first()


def upsert_about(db: Session, data: dict):
    about = db.query(About).first()
    if about:
        for k, v in data.items():
            setattr(about, k, v)
    else:
        about = About(**data)
        db.add(about)
    db.commit()
    db.refresh(about)
    return about


# ── Services ───────────────────────────────────────────────────────────────────
def get_services(db: Session):
    return db.query(Service).filter(Service.is_active == True).order_by(Service.order).all()


def get_service(db: Session, service_id: int):
    return db.query(Service).filter(Service.id == service_id).first()


def create_service(db: Session, data: ServiceCreate):
    obj = Service(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_service(db: Session, service_id: int, data: dict):
    obj = db.query(Service).filter(Service.id == service_id).first()
    if obj:
        for k, v in data.items():
            setattr(obj, k, v)
        db.commit()
        db.refresh(obj)
    return obj


def delete_service(db: Session, service_id: int):
    obj = db.query(Service).filter(Service.id == service_id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return obj


# ── Skills ─────────────────────────────────────────────────────────────────────
def get_skills(db: Session):
    return db.query(Skill).order_by(Skill.category, Skill.order).all()


def get_skill(db: Session, skill_id: int):
    return db.query(Skill).filter(Skill.id == skill_id).first()


def create_skill(db: Session, data: SkillCreate):
    obj = Skill(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_skill(db: Session, skill_id: int, data: dict):
    obj = db.query(Skill).filter(Skill.id == skill_id).first()
    if obj:
        for k, v in data.items():
            setattr(obj, k, v)
        db.commit()
        db.refresh(obj)
    return obj


def delete_skill(db: Session, skill_id: int):
    obj = db.query(Skill).filter(Skill.id == skill_id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return obj


# ── Certifications ─────────────────────────────────────────────────────────────
def get_certifications(db: Session):
    return db.query(Certification).order_by(Certification.issued_date.desc()).all()


def get_certification(db: Session, cert_id: int):
    return db.query(Certification).filter(Certification.id == cert_id).first()


def create_certification(db: Session, data: CertificationCreate):
    obj = Certification(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_certification(db: Session, cert_id: int, data: dict):
    obj = db.query(Certification).filter(Certification.id == cert_id).first()
    if obj:
        for k, v in data.items():
            setattr(obj, k, v)
        db.commit()
        db.refresh(obj)
    return obj


def delete_certification(db: Session, cert_id: int):
    obj = db.query(Certification).filter(Certification.id == cert_id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return obj


# ── Projects ───────────────────────────────────────────────────────────────────
def get_projects(db: Session):
    return db.query(Project).order_by(Project.is_featured.desc(), Project.order).all()


def get_project(db: Session, project_id: int):
    return db.query(Project).filter(Project.id == project_id).first()


def create_project(db: Session, data: ProjectCreate):
    obj = Project(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_project(db: Session, project_id: int, data: dict):
    obj = db.query(Project).filter(Project.id == project_id).first()
    if obj:
        for k, v in data.items():
            setattr(obj, k, v)
        db.commit()
        db.refresh(obj)
    return obj


def delete_project(db: Session, project_id: int):
    obj = db.query(Project).filter(Project.id == project_id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return obj


# ── Contact ────────────────────────────────────────────────────────────────────
def create_contact_message(db: Session, data: ContactCreate):
    obj = ContactMessage(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_contact_messages(db: Session):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()


def mark_message_read(db: Session, msg_id: int):
    obj = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if obj:
        obj.is_read = True
        db.commit()
        db.refresh(obj)
    return obj


def delete_message(db: Session, msg_id: int):
    obj = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return obj


# ── Experience ─────────────────────────────────────────────────────────────────
def get_experiences(db: Session):
    return db.query(Experience).order_by(Experience.order, Experience.created_at.desc()).all()

def create_experience(db: Session, data: ExperienceCreate):
    obj = Experience(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

def update_experience(db: Session, exp_id: int, data: dict):
    obj = db.query(Experience).filter(Experience.id == exp_id).first()
    if obj:
        for k, v in data.items(): setattr(obj, k, v)
        db.commit(); db.refresh(obj)
    return obj

def delete_experience(db: Session, exp_id: int):
    obj = db.query(Experience).filter(Experience.id == exp_id).first()
    if obj: db.delete(obj); db.commit()
    return obj


# ── Testimonials ───────────────────────────────────────────────────────────────
def get_testimonials(db: Session, active_only: bool = False):
    q = db.query(Testimonial)
    if active_only: q = q.filter(Testimonial.is_active == True)
    return q.order_by(Testimonial.order, Testimonial.created_at.desc()).all()

def create_testimonial(db: Session, data: TestimonialCreate):
    obj = Testimonial(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

def update_testimonial(db: Session, t_id: int, data: dict):
    obj = db.query(Testimonial).filter(Testimonial.id == t_id).first()
    if obj:
        for k, v in data.items(): setattr(obj, k, v)
        db.commit(); db.refresh(obj)
    return obj

def delete_testimonial(db: Session, t_id: int):
    obj = db.query(Testimonial).filter(Testimonial.id == t_id).first()
    if obj: db.delete(obj); db.commit()
    return obj


# ── Articles ───────────────────────────────────────────────────────────────────
def get_articles(db: Session, published_only: bool = False):
    q = db.query(Article)
    if published_only: q = q.filter(Article.is_published == True)
    return q.order_by(Article.created_at.desc()).all()

def get_article_by_slug(db: Session, slug: str):
    return db.query(Article).filter(Article.slug == slug).first()

def get_article(db: Session, article_id: int):
    return db.query(Article).filter(Article.id == article_id).first()

def create_article(db: Session, data: ArticleCreate):
    obj = Article(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

def update_article(db: Session, article_id: int, data: dict):
    obj = db.query(Article).filter(Article.id == article_id).first()
    if obj:
        for k, v in data.items(): setattr(obj, k, v)
        db.commit(); db.refresh(obj)
    return obj

def delete_article(db: Session, article_id: int):
    obj = db.query(Article).filter(Article.id == article_id).first()
    if obj: db.delete(obj); db.commit()
    return obj
