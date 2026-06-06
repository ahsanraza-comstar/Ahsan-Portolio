# Deployment Guide

**Stack:** Vercel (frontend) + Railway (backend) + Cloudflare (domain).

---

## 1. Prep

```bash
# from repo root
git add .
git commit -m "Add deploy config"
git push origin main
```

Make sure `.env` is **not** committed (already gitignored).

---

## 2. Backend → Railway

1. Go to <https://railway.app> → **New Project → Deploy from GitHub repo**.
2. Select this repo, then **Add Service → GitHub Repo → set root directory to `backend`**.
3. **Add a Volume** (Settings → Volumes) mounted at `/data` — this keeps SQLite alive between deploys.
4. **Variables** (paste these, fill the blanks):
   ```
   SECRET_KEY=<run: python -c "import secrets; print(secrets.token_hex(32))">
   ADMIN_EMAIL=ahsanaj695@gmail.com
   ADMIN_PASSWORD=<strong-password-here>
   DATABASE_URL=sqlite:////data/portfolio.db
   ALLOWED_ORIGINS=https://ahsanraza.dev,https://www.ahsanraza.dev
   MAIL_USERNAME=ahsanaj695@gmail.com
   MAIL_PASSWORD=<gmail-app-password>
   MAIL_FROM=ahsanaj695@gmail.com
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   DOCS_ENABLED=false
   ```
5. Railway auto-detects Python via `nixpacks.toml` and runs `uvicorn app.main:app`.
6. Once deployed, copy the public URL (e.g. `https://yourapp.up.railway.app`).

### Custom domain for backend
- Railway → Settings → Networking → **Custom Domain** → `api.ahsanraza.dev`
- Add the CNAME Railway shows you in Cloudflare DNS.

### Seed initial content
Open Railway shell (or run locally pointing to remote DB):
```bash
python seed.py
```

---

## 3. Frontend → Vercel

1. Go to <https://vercel.com> → **Add New → Project → Import Git Repository**.
2. **Root Directory:** `frontend`
3. **Framework Preset:** Vite (auto-detected)
4. **Environment Variables:**
   ```
   VITE_API_URL=https://api.ahsanraza.dev
   ```
5. Deploy. Vercel gives you `https://your-app.vercel.app`.

### Custom domain for frontend
- Vercel → Project → Settings → **Domains** → add `ahsanraza.dev` and `www.ahsanraza.dev`.
- Vercel shows DNS records — add them in Cloudflare:
  - `A` record `@` → `76.76.21.21`
  - `CNAME` record `www` → `cname.vercel-dns.com`
- Vercel auto-issues SSL within minutes.

---

## 4. Domain → Cloudflare

1. Buy `ahsanraza.dev` at <https://dash.cloudflare.com> → **Domain Registration**.
2. Add the DNS records above.
3. (Optional) Enable Cloudflare proxy (orange cloud) for DDoS protection.
   - For `api.ahsanraza.dev`, **leave it grey-clouded (DNS-only)** so Railway's SSL works.

---

## 5. Smoke test

- Visit `https://ahsanraza.dev` → site loads.
- Open DevTools → Network → confirm API calls go to `https://api.ahsanraza.dev`.
- Submit contact form → check inbox.
- Login at `/admin` → confirm CMS works and changes persist after a redeploy.

---

## Cost summary

| Service | Plan | Cost |
|---|---|---|
| Cloudflare domain | `.dev` | ~$11/year |
| Vercel | Hobby | Free |
| Railway | Hobby | $5/month credit (usually enough) |

**Total:** ~$11/year + ~$5/month if you exceed free credit.
