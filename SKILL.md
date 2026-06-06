---
name: ai-engineer-portfolio
description: >
  Full-stack AI Engineer portfolio website with a stunning dark UI, 
  advanced animations, Python/FastAPI backend, React frontend, and 
  a secure admin dashboard. Sections: Hero, About, Services, Skills, 
  Certifications, Projects, and Contact.
---

# AI Engineer Portfolio — Full-Stack Skill

You are building a **premium, full-stack AI Engineer portfolio** for a developer who wants to showcase their identity through code and design. This skill covers the complete architecture, design system, frontend, backend, and admin panel.

---

## SECTION 1 — DESIGN IDENTITY & PHILOSOPHY

### Aesthetic Direction: "Neural Dusk"
This portfolio lives in the intersection of **organic intelligence** and **precise engineering**. The vibe is **cinematic dark** — not blue-black, not purple-haze. Think:

- Deep charcoal backgrounds with **amber/gold + emerald/teal** as primary accents
- Warm glows that feel like bioluminescent code
- Typography that feels editorial, not corporate
- Animations that feel **alive** — not bouncy, not robotic — fluid like thought

### Color System (CSS Variables)

```css
:root {
  /* Backgrounds — layered depth */
  --bg-void:       #0a0a08;   /* deepest — page base */
  --bg-deep:       #0f0f0c;   /* cards, panels */
  --bg-surface:    #161612;   /* elevated surfaces */
  --bg-raised:     #1e1e19;   /* hover states */
  --bg-overlay:    #252520;   /* modals, drawers */

  /* Primary accent — Liquid Amber */
  --amber-dim:     #b8860b;
  --amber-mid:     #d4a017;
  --amber-bright:  #f5c518;
  --amber-glow:    rgba(245, 197, 24, 0.15);
  --amber-halo:    rgba(245, 197, 24, 0.06);

  /* Secondary accent — Bio Teal */
  --teal-dim:      #0d7377;
  --teal-mid:      #14a085;
  --teal-bright:   #1de9b6;
  --teal-glow:     rgba(29, 233, 182, 0.12);

  /* Tertiary accent — Ember Rose (sparingly) */
  --rose-dim:      #8b2635;
  --rose-mid:      #c0392b;
  --rose-bright:   #ff6b6b;

  /* Text hierarchy */
  --text-primary:  #f0ede6;   /* headlines */
  --text-body:     #b8b4a8;   /* body copy */
  --text-muted:    #6b6860;   /* captions, labels */
  --text-accent:   #f5c518;   /* highlighted text */

  /* Borders & dividers */
  --border-subtle: rgba(245, 197, 24, 0.08);
  --border-mid:    rgba(245, 197, 24, 0.18);
  --border-bright: rgba(245, 197, 24, 0.35);

  /* Effects */
  --shadow-amber:  0 0 40px rgba(245, 197, 24, 0.08);
  --shadow-teal:   0 0 40px rgba(29, 233, 182, 0.08);
  --noise-opacity: 0.03;

  /* Spacing & radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 32px;
}
```

### Typography

```css
/* Import in index.html or main.css */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');

/* Display / Hero headings */
--font-display: 'Playfair Display', Georgia, serif;

/* Body / UI text */
--font-body: 'Outfit', sans-serif;

/* Code / labels / data */
--font-mono: 'JetBrains Mono', monospace;
```

### Animation Timing Conventions

```css
/* All animations must use these easings */
--ease-smooth:  cubic-bezier(0.16, 1, 0.3, 1);     /* snappy entrances */
--ease-out:     cubic-bezier(0.0, 0.0, 0.2, 1);    /* exits */
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1); /* playful bounces */

/* Durations */
--dur-instant: 80ms;
--dur-fast:    200ms;
--dur-normal:  400ms;
--dur-slow:    700ms;
--dur-cinematic: 1200ms;
```

---

## SECTION 2 — PROJECT ARCHITECTURE

```
portfolio/
├── frontend/                   # React + Vite
│   ├── public/
│   ├── src/
│   │   ├── assets/             # SVGs, fonts, textures
│   │   ├── components/
│   │   │   ├── ui/             # Reusable: Button, Card, Badge, Input
│   │   │   ├── layout/         # Navbar, Footer, Section
│   │   │   └── sections/       # Hero, About, Services, Skills,
│   │   │                       #   Certifications, Projects, Contact
│   │   ├── admin/              # Admin dashboard (protected)
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── editors/        # Per-section CRUD editors
│   │   ├── hooks/              # useScrollReveal, useParticles, useAPI
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── lib/                # api.js, animations.js, utils.js
│   │   ├── styles/             # globals.css, variables.css, animations.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                    # Python FastAPI
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py     # JWT login
│   │   │   │   ├── about.py
│   │   │   │   ├── services.py
│   │   │   │   ├── skills.py
│   │   │   │   ├── certifications.py
│   │   │   │   ├── projects.py
│   │   │   │   └── contact.py
│   │   │   └── deps.py         # JWT dependency
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── crud/               # DB operations
│   │   ├── core/
│   │   │   ├── config.py       # env settings
│   │   │   ├── security.py     # password + JWT
│   │   │   └── database.py     # SQLite/PostgreSQL engine
│   │   └── main.py             # FastAPI app entry
│   ├── alembic/                # DB migrations
│   ├── requirements.txt
│   └── .env
│
└── docker-compose.yml          # Optional: containerize everything
```

---

## SECTION 3 — BACKEND IMPLEMENTATION (Python / FastAPI)

### 3.1 requirements.txt

```
fastapi==0.111.0
uvicorn[standard]==0.29.0
sqlalchemy==2.0.30
alembic==1.13.1
pydantic[email]==2.7.1
pydantic-settings==2.2.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
aiofiles==23.2.1
Pillow==10.3.0
python-dotenv==1.0.1
# For email (contact form):
fastapi-mail==1.4.1
```

### 3.2 core/config.py

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Engineer Portfolio"
    SECRET_KEY: str                          # set in .env
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 8  # 8 hours

    DATABASE_URL: str = "sqlite:///./portfolio.db"

    ADMIN_EMAIL: str                         # set in .env
    ADMIN_PASSWORD: str                      # set in .env

    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = ""
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_PORT: int = 587

    class Config:
        env_file = ".env"

settings = Settings()
```

### 3.3 Database Models (models/)

Create one model per section. All models should include `id`, `created_at`, `updated_at`.

**About** — single-row (upsert)
```python
class About(Base):
    __tablename__ = "about"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    tagline = Column(String)              # "AI Engineer & Builder"
    bio = Column(Text)                    # rich markdown text
    avatar_url = Column(String)
    resume_url = Column(String)
    location = Column(String)
    years_experience = Column(Integer)
    github_url = Column(String)
    linkedin_url = Column(String)
    twitter_url = Column(String)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

**Service**
```python
class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    icon = Column(String)              # lucide icon name or SVG string
    accent_color = Column(String)      # e.g. "amber" | "teal" | "rose"
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
```

**Skill**
```python
class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String)           # "ML/AI" | "Backend" | "Frontend" | "DevOps"
    proficiency = Column(Integer)       # 0–100
    icon_url = Column(String)
    order = Column(Integer, default=0)
```

**Certification**
```python
class Certification(Base):
    __tablename__ = "certifications"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    issuer = Column(String)
    issued_date = Column(Date)
    expiry_date = Column(Date, nullable=True)
    credential_url = Column(String)
    badge_url = Column(String)
    description = Column(Text)
```

**Project**
```python
class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    long_description = Column(Text)
    thumbnail_url = Column(String)
    demo_url = Column(String)
    repo_url = Column(String)
    tech_stack = Column(JSON)           # ["Python", "FastAPI", "LangChain"]
    category = Column(String)           # "AI/ML" | "Web" | "Research"
    is_featured = Column(Boolean, default=False)
    order = Column(Integer, default=0)
```

**ContactMessage** (write-only from public; read from admin)
```python
class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    subject = Column(String)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### 3.4 Auth Routes (api/routes/auth.py)

```python
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Verify admin email + bcrypt password
    # Return: {"access_token": "...", "token_type": "bearer"}

@router.get("/me")
async def get_me(current_user = Depends(get_current_admin)):
    return {"email": settings.ADMIN_EMAIL, "role": "admin"}
```

### 3.5 Section Routes Pattern

Every section (about, services, skills, certifications, projects) follows this REST pattern:

```
PUBLIC (no auth):
  GET  /api/{section}           → list or single record
  GET  /api/{section}/{id}      → detail

ADMIN (Bearer JWT required):
  POST   /api/{section}         → create
  PUT    /api/{section}/{id}    → update
  DELETE /api/{section}/{id}    → delete
  POST   /api/{section}/reorder → update order array
```

**File Upload Endpoint** (for images):
```python
@router.post("/upload")
async def upload_file(file: UploadFile = File(...), current_admin = Depends(get_current_admin)):
    # Save to /uploads/ dir, return public URL
    # Resize to max 1200px wide with Pillow
    # Return: {"url": "/uploads/filename.webp"}
```

### 3.6 Contact Route (public POST + admin GET)

```python
@router.post("/contact")
async def send_message(msg: ContactCreate, db: Session = Depends(get_db)):
    # 1. Save to DB
    # 2. Send email notification via fastapi-mail (if configured)
    # 3. Return 200

@router.get("/contact", dependencies=[Depends(get_current_admin)])
async def list_messages(db: Session = Depends(get_db)):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
```

### 3.7 main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include all routers with /api prefix
app.include_router(auth_router,          prefix="/api/auth")
app.include_router(about_router,         prefix="/api/about")
app.include_router(services_router,      prefix="/api/services")
app.include_router(skills_router,        prefix="/api/skills")
app.include_router(certifications_router,prefix="/api/certifications")
app.include_router(projects_router,      prefix="/api/projects")
app.include_router(contact_router,       prefix="/api/contact")

@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)
    seed_admin_if_not_exists()   # create admin user from .env
```

---

## SECTION 4 — FRONTEND IMPLEMENTATION (React + Vite)

### 4.1 package.json dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.23.0",
    "framer-motion": "^11.2.0",
    "@tanstack/react-query": "^5.40.0",
    "axios": "^1.7.0",
    "lucide-react": "^0.383.0",
    "react-hook-form": "^7.51.0",
    "react-hot-toast": "^2.4.1",
    "react-markdown": "^9.0.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "react-type-animation": "^3.2.0",
    "react-intersection-observer": "^9.10.0",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "vite": "^5.2.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.19"
  }
}
```

### 4.2 Global CSS (styles/globals.css)

```css
/* Import variables from Section 1 */
/* Noise texture overlay on body */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: var(--noise-opacity);
  pointer-events: none;
  z-index: 9999;
}

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg-void); }
::-webkit-scrollbar-thumb { background: var(--amber-dim); border-radius: 2px; }

/* Selection */
::selection { background: var(--amber-glow); color: var(--amber-bright); }

/* Smooth scroll */
html { scroll-behavior: smooth; }
```

### 4.3 Scroll Reveal Hook (hooks/useScrollReveal.js)

```js
import { useEffect, useRef } from 'react';

export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, ...options }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}
```

```css
/* In globals.css */
.reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s var(--ease-smooth), transform 0.7s var(--ease-smooth); }
.reveal.revealed { opacity: 1; transform: none; }
.reveal-left { opacity: 0; transform: translateX(-28px); transition: opacity 0.7s var(--ease-smooth), transform 0.7s var(--ease-smooth); }
.reveal-left.revealed { opacity: 1; transform: none; }
```

---

## SECTION 5 — SECTION-BY-SECTION FRONTEND SPECS

### 5.1 Navbar

```
Behavior:
- Transparent at top, frosted-glass on scroll (backdrop-filter: blur(20px) + amber border-bottom)
- Logo: Your Name in Playfair Display + monospace ".ai" suffix
- Links: About | Services | Skills | Certs | Projects | Contact
- Active section highlight with amber underline animation
- Mobile: slide-in hamburger drawer from right
- Admin link: small gear icon (top-right), only visible if admin JWT present
```

**Frosted nav on scroll CSS:**
```css
.navbar-scrolled {
  background: rgba(10, 10, 8, 0.85);
  backdrop-filter: blur(20px) saturate(140%);
  border-bottom: 1px solid var(--border-subtle);
  box-shadow: 0 4px 30px rgba(0,0,0,0.4);
}
```

### 5.2 Hero Section

```
Layout: full viewport height, centered

Left column (60%):
  - Greeting: "Hello, I'm" (Outfit 300, muted)
  - Name: Dynamic from API (Playfair Display, 72–96px, text-primary)
  - Role: TypeAnimation cycling through:
      "AI Engineer", "LLM Architect", "ML Practitioner", "Python Developer"
    (amber colored, monospace font)
  - Bio excerpt: first 200 chars from About
  - CTAs: [View Projects →] [Download CV ↓]
  - Social links: GitHub | LinkedIn | Twitter

Right column (40%):
  - Animated avatar container:
      - Hexagonal clip-path frame with amber border animation
      - Orbiting teal dots (CSS keyframe animation)
      - Subtle particle field behind (canvas or pure CSS)

Background:
  - Large faint text "AI" watermark (Playfair, opacity 0.03, 40vw)
  - Radial gradient glow: amber at left 15%, teal at right 20%
  - Grid dot pattern (CSS background-image: radial-gradient)
```

**Orbit animation:**
```css
@keyframes orbit {
  from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
}
.orbit-dot {
  position: absolute;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--teal-bright);
  animation: orbit 6s linear infinite;
  box-shadow: 0 0 12px var(--teal-bright);
}
.orbit-dot:nth-child(2) { animation-delay: -2s; background: var(--amber-bright); }
.orbit-dot:nth-child(3) { animation-delay: -4s; }
```

### 5.3 About Section

```
Layout: Two columns
Left: Large photo with overlay stats (years experience, projects count, etc.)
Right: 
  - Section label: "< about />" in monospace amber
  - Headline in Playfair Display
  - Bio in markdown (react-markdown)
  - Location chip, experience chips
  - [Download Resume] button

Stats: Animated counter on scroll-reveal
  - e.g. "42+ Projects", "5+ Years", "12+ Certifications"
  - Numbers count up from 0 when section enters viewport
```

### 5.4 Services Section

```
Layout: 3-column card grid (2-col on tablet, 1-col on mobile)

Each card:
  - Top: Icon (large, colored with service accent)
  - Divider: thin amber line with glow
  - Title + description
  - Hover: card lifts (transform: translateY(-8px)), border brightens
  - Border: 1px solid var(--border-subtle), hover → var(--border-mid)
  - Background: var(--bg-deep) with inner glow on hover

Card entrance: staggered reveal (150ms delay between cards)
```

### 5.5 Skills Section

```
Layout: Tabs by category (ML/AI | Backend | Frontend | DevOps | Tools)
          ↓
         Grid of skill cards per category

Each skill card:
  - Icon (from icon_url or fallback SVG)
  - Skill name
  - Animated progress bar:
      - Background: var(--bg-raised)
      - Fill: gradient from amber-dim → amber-bright
      - Width animates from 0 → proficiency% when tab/section revealed
      - Glow at right end: box-shadow with amber

Tab styling:
  - Active tab: amber bottom border + text-accent
  - Inactive: text-muted
  - Smooth slide indicator

Alternative layout (if many skills):
  - Tag cloud with font-size proportional to proficiency
  - Teal/amber alternating colors
```

**Progress bar animation:**
```css
@keyframes fillBar {
  from { width: 0; }
  to   { width: var(--target-width); }
}
.skill-bar-fill {
  width: 0;
  animation: fillBar 0.9s var(--ease-smooth) forwards;
  animation-delay: var(--delay, 0s);
  background: linear-gradient(90deg, var(--amber-dim), var(--amber-bright));
  box-shadow: 4px 0 12px var(--amber-glow);
}
```

### 5.6 Certifications Section

```
Layout: Horizontal scroll carousel on mobile, masonry grid on desktop

Each cert card:
  - Badge image (circular, with amber ring)
  - Issuer logo or text
  - Cert title
  - Date range
  - "Verify →" link (external badge URL)
  - Subtle ribbon / banner in corner for featured certs

Grid: 3 columns desktop, 2 tablet, 1 mobile
Hover: Scale 1.03, amber glow border
```

### 5.7 Projects Section

```
Layout: Featured project (full-width card) + grid below

Featured card:
  - Full-width with thumbnail background (dark overlay gradient)
  - Title, description, tech stack badges
  - [Live Demo] [GitHub] buttons
  - "Featured" tag in amber

Grid cards:
  - Thumbnail with overlay on hover
  - Tech stack badges (small pills, monospace)
  - Category filter (ML/AI | Web | Research | All)
    → Animated filter with Framer Motion layout animations

Tech badge colors:
  - Python → amber
  - FastAPI/Flask → teal
  - React → rose
  - Others → muted

Hover state: Image zooms in slightly (transform: scale(1.05))
              Overlay fades in with title + links
```

### 5.8 Contact Section

```
Layout: Split — left info, right form

Left side:
  - Section heading
  - "Let's build something together" subtitle
  - Contact info: email, location
  - Social links with icons
  - Decorative: terminal-style box with blinking cursor

Right side — Form:
  - Name, Email, Subject (inputs styled as underline-only)
  - Message (textarea, auto-resize)
  - [Send Message →] button with loading state + success/error toast

Input styles:
  - Background: transparent
  - Border: 1px solid var(--border-subtle), focus → var(--border-bright)
  - Label: floats up on focus (CSS animation)
  - Focus glow: box-shadow 0 0 0 3px var(--amber-halo)
  
Submit button:
  - Background: transparent
  - Border: 2px solid var(--amber-bright)
  - Text: amber
  - Hover: background fills amber, text turns dark
  - Animation: shimmer sweep on hover
```

---

## SECTION 6 — ADMIN DASHBOARD

### 6.1 Route & Auth

```jsx
// App.jsx routing
<Route path="/admin" element={<AdminLogin />} />
<Route path="/admin/dashboard/*" element={
  <PrivateRoute>
    <AdminDashboard />
  </PrivateRoute>
} />
```

```jsx
// PrivateRoute.jsx
export function PrivateRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/admin" />;
  return children;
}
```

### 6.2 Admin Login Page

```
Design: Centered card on dark bg
- Logo / name at top
- Email + Password inputs
- [Login] button
- Error shake animation on wrong credentials
- JWT stored in localStorage on success
- Redirect to /admin/dashboard
```

### 6.3 Admin Dashboard Layout

```
Sidebar navigation (collapsible):
  - Profile pic + "Admin Panel" label
  - Nav items: About | Services | Skills | Certifications | Projects | Messages
  - [View Site] link | [Logout] button
  - Active item: amber highlight

Main area:
  - Header bar with section title + [+ Add New] button
  - Content area renders section editor
```

### 6.4 Section Editors

**About Editor:**
- Form with all About model fields
- Image upload (drag & drop → preview → upload to API)
- Markdown editor for bio (with preview toggle)
- [Save Changes] button

**Services Editor:**
- Drag-to-reorder list (using @dnd-kit or simple up/down arrows)
- Inline edit form
- Toggle active/inactive

**Skills Editor:**
- Filter by category
- Add new skill: name, category, proficiency slider (0–100), icon upload
- Delete with confirm dialog

**Certifications Editor:**
- Table view with thumbnail previews
- Add/Edit modal
- Date pickers

**Projects Editor:**
- Card grid with [Edit] [Delete] overlays
- Detailed modal editor:
  - All project fields
  - Tech stack: tag input (type + Enter to add)
  - Image upload with preview
  - Featured toggle
  - Drag to reorder

**Messages (Contact):**
- Table: sender name, email, subject, date, read status
- Click to expand full message
- Mark as read button
- Delete button

### 6.5 Admin UI Styles

```css
/* Admin uses same color system but with slightly lighter surfaces */
.admin-sidebar {
  background: var(--bg-deep);
  border-right: 1px solid var(--border-subtle);
}
.admin-nav-item.active {
  background: var(--amber-halo);
  border-left: 3px solid var(--amber-bright);
  color: var(--amber-bright);
}
.admin-table tr:hover {
  background: var(--bg-raised);
}
```

---

## SECTION 7 — SPECIAL EFFECTS & ANIMATIONS

### 7.1 Animated Background Grid

```css
/* Subtle dot grid that pulses */
.grid-bg {
  background-image: radial-gradient(circle, rgba(245,197,24,0.12) 1px, transparent 1px);
  background-size: 32px 32px;
  animation: gridPulse 8s ease-in-out infinite;
}
@keyframes gridPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}
```

### 7.2 Glitch Text Effect (for "AI" watermark or hover effects)

```css
@keyframes glitch {
  0%, 100% { clip-path: none; transform: none; }
  20% { clip-path: rect(0,900px,10px,0); transform: translateX(-3px); }
  40% { clip-path: rect(50px,900px,80px,0); transform: translateX(3px); }
  60% { clip-path: rect(20px,900px,40px,0); transform: translateX(-2px); }
}
.glitch:hover::before {
  content: attr(data-text);
  position: absolute;
  color: var(--teal-bright);
  animation: glitch 0.4s steps(1) infinite;
}
```

### 7.3 Ambient Cursor Glow

```js
// hooks/useCursorGlow.js
export function useCursorGlow() {
  useEffect(() => {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    const move = (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    };
    window.addEventListener('mousemove', move);
    return () => { window.removeEventListener('mousemove', move); document.body.removeChild(glow); };
  }, []);
}
```

```css
.cursor-glow {
  position: fixed;
  width: 300px; height: 300px;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(245,197,24,0.04) 0%, transparent 70%);
  transition: left 0.1s, top 0.1s;
  z-index: 0;
}
```

### 7.4 Section Transition: Diagonal Dividers

```css
/* Between sections use diagonal clip or SVG wave */
.section-divider {
  height: 80px;
  background: var(--bg-deep);
  clip-path: polygon(0 0, 100% 40%, 100% 100%, 0 100%);
  margin-top: -2px;
}
```

### 7.5 Terminal Component (Contact section decoration)

```jsx
const terminalLines = [
  '$ whoami',
  '> AI Engineer & Builder',
  '$ cat interests.txt',
  '> LLMs, Agents, MLOps, APIs',
  '$ ping collaboration',
  '> Response: 200 OK ✓',
];
// Animate each line typing in with 500ms delay between lines
// Blinking cursor at the end using CSS animation
```

---

## SECTION 8 — API INTEGRATION (lib/api.js)

```js
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });

// Attach token for admin calls
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('admin_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Public endpoints
export const getAbout         = () => api.get('/api/about');
export const getServices      = () => api.get('/api/services');
export const getSkills        = () => api.get('/api/skills');
export const getCertifications= () => api.get('/api/certifications');
export const getProjects      = () => api.get('/api/projects');
export const sendMessage      = (data) => api.post('/api/contact', data);

// Admin endpoints
export const adminLogin   = (creds) => api.post('/api/auth/login', creds, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
export const updateAbout  = (data) => api.put('/api/about', data);
export const createProject= (data) => api.post('/api/projects', data);
export const updateProject= (id, data) => api.put(`/api/projects/${id}`, data);
export const deleteProject= (id) => api.delete(`/api/projects/${id}`);
// ... pattern repeats for all sections

export const uploadFile = (formData) => api.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
```

---

## SECTION 9 — STEP-BY-STEP BUILD INSTRUCTIONS FOR CLAUDE CODE

When executing this skill, follow these phases in order:

### Phase 1: Backend Setup
```bash
mkdir -p portfolio/backend/app/{api/routes,models,schemas,crud,core}
cd portfolio/backend
python -m venv venv && source venv/bin/activate
pip install fastapi uvicorn sqlalchemy pydantic-settings python-jose passlib python-multipart aiofiles Pillow python-dotenv
```
1. Create `.env` with `SECRET_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
2. Implement `core/config.py`, `core/database.py`, `core/security.py`
3. Implement all models in `models/`
4. Implement all schemas (Pydantic) in `schemas/`
5. Implement CRUD functions in `crud/`
6. Implement all API routes in `api/routes/`
7. Wire everything in `main.py`
8. Run: `uvicorn app.main:app --reload`
9. Test via `http://localhost:8000/docs` (Swagger UI)

### Phase 2: Frontend Scaffold
```bash
cd portfolio
npm create vite@latest frontend -- --template react
cd frontend && npm install
npm install framer-motion @tanstack/react-query axios lucide-react react-hook-form react-hot-toast react-markdown react-type-animation react-intersection-observer react-router-dom date-fns
npm install -D tailwindcss autoprefixer
npx tailwindcss init -p
```
1. Set up `tailwind.config.js` with custom colors matching the design system
2. Create `styles/variables.css` with all CSS variables from Section 1
3. Create `styles/globals.css` with global styles
4. Create `styles/animations.css` with all keyframe animations

### Phase 3: Core Components
Build in this order:
1. `ui/Button.jsx` — variants: primary, ghost, outline; sizes: sm, md, lg
2. `ui/Card.jsx` — with amber border and hover glow
3. `ui/Badge.jsx` — tech stack tags
4. `ui/Input.jsx` — floating label style
5. `ui/SectionLabel.jsx` — the `< section_name />` monospace headers
6. `layout/Navbar.jsx`
7. `layout/Footer.jsx`
8. `layout/Section.jsx` — wrapper with consistent padding

### Phase 4: Public Sections (in order)
Hero → About → Services → Skills → Certifications → Projects → Contact

### Phase 5: Admin Dashboard
1. `AdminLogin.jsx`
2. `AdminDashboard.jsx` with sidebar
3. One editor per section (About, Services, Skills, Certifications, Projects, Messages)
4. AuthContext for token management

### Phase 6: Integration & Polish
1. Connect all sections to real API data via react-query
2. Add loading skeletons (pulsing amber shimmer)
3. Add error boundaries
4. Add ambient cursor glow
5. Test responsive breakpoints (320px, 768px, 1024px, 1440px)
6. Add `<meta>` SEO tags based on About data

---

## SECTION 10 — RESPONSIVE BREAKPOINTS

```css
/* Mobile first */
/* Base: < 640px */
/* sm: 640px  — tablet portrait */
/* md: 768px  — tablet landscape */
/* lg: 1024px — small desktop */
/* xl: 1280px — desktop */
/* 2xl: 1536px — wide */

/* Key layout changes:
   - Hero: stacked at < md, side-by-side at md+
   - Services: 1-col at sm, 2-col at md, 3-col at lg
   - Skills tabs: horizontal scroll at < md
   - Projects grid: 1-col at sm, 2-col at md, 3-col at xl
   - Admin sidebar: hidden on mobile (hamburger toggle)
*/
```

---

## SECTION 11 — PERFORMANCE REQUIREMENTS

- All images served as WebP (convert on upload in backend with Pillow)
- Lazy load images below the fold (`loading="lazy"`)
- Code splitting: admin dashboard loaded as a lazy React route
- API responses cached with react-query (staleTime: 5 minutes)
- Font preloaded: `<link rel="preload" as="font">`
- Cumulative Layout Shift (CLS) < 0.1
- First Contentful Paint (FCP) < 1.5s

---

## SECTION 12 — DEPLOYMENT NOTES

### Backend (Python/FastAPI)
- **Development**: `uvicorn app.main:app --reload --port 8000`
- **Production**: Use `gunicorn` with `uvicorn` workers, or deploy to Railway / Render
- SQLite for dev, PostgreSQL for production (change `DATABASE_URL` in .env)
- CORS: update allowed_origins with your actual domain

### Frontend (React)
- **Development**: `npm run dev` (Vite dev server, port 5173)
- **Production**: `npm run build` → `dist/` → deploy to Vercel / Netlify
- Set `VITE_API_URL` environment variable to your backend URL

### Environment Variables Required:
**Backend `.env`:**
```
SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_hex(32))">
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your_secure_password
DATABASE_URL=sqlite:///./portfolio.db
```

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:8000
```

---

## QUICK REFERENCE — SECTION IDs FOR SMOOTH SCROLL

```
#hero          → Hero / Landing
#about         → About Me
#services      → Services
#skills        → Skills
#certifications→ Certifications
#projects      → Projects
#contact       → Contact
/admin         → Admin Login
/admin/dashboard → Admin Dashboard
```

---

*This skill produces a portfolio that is uniquely yours — a dark, warm, cinematic experience that showcases an AI Engineer's technical depth and creative precision.*
