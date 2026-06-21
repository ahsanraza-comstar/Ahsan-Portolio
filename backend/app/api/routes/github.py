import json
import time
import urllib.request
import urllib.error

from fastapi import APIRouter, Query

from app.core.config import settings

router = APIRouter()

# Simple in-memory cache: { user: (timestamp, data) }. Avoids hitting GitHub's
# anonymous rate limit (60/hr per IP) on every visitor — one fetch per TTL window.
_cache = {}
TTL = 1800  # 30 minutes


def _gh(url):
    req = urllib.request.Request(url, headers={
        "Accept": "application/vnd.github+json",
        "User-Agent": "ahsan-portfolio",
    })
    token = getattr(settings, "GITHUB_TOKEN", "") or ""
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())


@router.get("")
def github_stats(user: str = Query("AhsanRaza-dev")):
    user = (user or "AhsanRaza-dev").strip()
    now = time.time()
    cached = _cache.get(user)
    if cached and now - cached[0] < TTL:
        return cached[1]

    try:
        profile = _gh(f"https://api.github.com/users/{user}")
        repos = _gh(f"https://api.github.com/users/{user}/repos?per_page=100&sort=pushed")
        if not isinstance(repos, list):
            repos = []

        total_stars = sum(r.get("stargazers_count", 0) for r in repos)
        top = sorted(
            [r for r in repos if not r.get("fork")],
            key=lambda r: (r.get("stargazers_count", 0), r.get("pushed_at", "")),
            reverse=True,
        )[:6]
        top_out = [{
            "id": r.get("id"),
            "name": r.get("name"),
            "description": r.get("description"),
            "html_url": r.get("html_url"),
            "language": r.get("language"),
            "stargazers_count": r.get("stargazers_count", 0),
        } for r in top]

        lang_count = {}
        for r in repos:
            lang = r.get("language")
            if lang:
                lang_count[lang] = lang_count.get(lang, 0) + 1
        langs = sorted(lang_count.items(), key=lambda x: x[1], reverse=True)[:8]

        data = {
            "profile": {
                "login": profile.get("login"),
                "public_repos": profile.get("public_repos", 0),
                "followers": profile.get("followers", 0),
                "following": profile.get("following", 0),
                "html_url": profile.get("html_url", f"https://github.com/{user}"),
                "avatar_url": profile.get("avatar_url", ""),
            },
            "totalStars": total_stars,
            "top": top_out,
            "langs": langs,
        }
        _cache[user] = (now, data)
        return data
    except Exception as e:
        print(f"[GitHub] fetch error for {user}: {e}")
        # Serve stale cache on failure rather than hiding the section entirely.
        if cached:
            return cached[1]
        return {"profile": None, "totalStars": 0, "top": [], "langs": []}
