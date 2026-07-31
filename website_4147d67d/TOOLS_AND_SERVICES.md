# Tools, services & languages used in this project

Whenever we add something new, it’s listed here so you have one place to check.

---

## Already in the project (before Shahmaran)

| What | Type | Used for |
|------|------|----------|
| **HTML / CSS / JavaScript** | Languages | Existing Curious Paisley site (index, protestsigns, etc.) |
| **Node.js** | Runtime | `package.json` scripts (e.g. build-sign-images) |

---

## Added for Shahmaran

### Backend & data (source of truth)

| What | Type | Used for |
|------|------|----------|
| **Supabase** | External service | Database (PostgreSQL), Auth (login/signup), and REST API. You’ll create a free project at [supabase.com](https://supabase.com). |
| **PostgreSQL** | Database (via Supabase) | Stores topics, content steps, translations, user progress. |

### Admin dashboard

| What | Type | Used for |
|------|------|----------|
| **Next.js** | Framework (runs on Node.js) | Admin app in `admin/` – create/edit topics and content. |
| **React** | UI library | Next.js uses React for the admin UI. |
| **TypeScript** | Language | Used in the Next.js/React admin code for types. |

### Web (Shahmaran page inside this site)

| What | Type | Used for |
|------|------|----------|
| **Supabase JS client** | Library | Browser script to talk to Supabase (fetch topics, progress, auth). Same HTML/CSS/JS as the rest of the site. |

### Mobile apps (Android & iOS)

| What | Type | Used for |
|------|------|----------|
| **Flutter** | Framework | One codebase for Android and iOS in `mobile/`. |
| **Dart** | Language | Flutter apps are written in Dart. |

### Version control

| What | Type | Used for |
|------|------|----------|
| **Git** | Tool | Backing up and versioning code. Repo can live on GitHub/GitLab/etc. |

---

## Summary

- **Languages:** HTML, CSS, JavaScript, TypeScript (admin), Dart (mobile), SQL (Supabase migrations).
- **Services:** Supabase (hosted; you create an account and project).
- **Frameworks/tools:** Node.js, Next.js, React, Flutter, Git.

We’ll add to this list if we introduce anything else (e.g. a specific animation library or deployment service).
