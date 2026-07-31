# Shahmaran – setup and Git

This repo contains:

- **Existing site** – `index.html`, `protestsigns.html`, etc.
- **Shahmaran page** – `shahmaran.html` (one page within the site; same nav and styles).
- **Backend** – Supabase (see `supabase/`): run the migration SQL in your project, then set URL + keys in admin and web.
- **Admin** – Next.js app in `admin/`: manage topics and steps for Shahmaran.
- **Mobile** – Flutter app in `mobile/`: Shahmaran on Android & iOS, same API.

Tools and languages are listed in **`TOOLS_AND_SERVICES.md`**.

---

## Backing up on Git

When you’re ready to use Git:

1. **Initialize a repo (if not already):**
   ```bash
   cd /Users/nika/Desktop/CuriousPaisley
   git init
   ```

2. **Add and commit:**
   ```bash
   git add .
   git commit -m "Initial commit: site, Shahmaran page, admin, Flutter, Supabase schema"
   ```

3. **Push to a remote (e.g. GitHub):**
   - Create a new repository on GitHub (or GitLab, etc.).
   - Add the remote and push:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/CuriousPaisley.git
     git branch -M main
     git push -u origin main
     ```

**Important:** Do not commit real API keys or secrets. `.env`, `.env.local`, and `admin/.env.local` are in `.gitignore`. Keep `js/shahmaran/config.js` with empty values in the repo, or use a build step / env for production keys.

---

## Run order

1. **Supabase** – Create a project. In SQL Editor, **copy the full contents** of `supabase/migrations/00001_shahmaran.sql` (open the file and copy the SQL), paste into the editor, and run. Then copy URL + anon key (and service role for admin).
2. **Web** – Open `index.html` or `shahmaran.html` in a browser (or use a local server). Put Supabase URL + anon key in `js/shahmaran/config.js` to load Shahmaran topics.
3. **Admin** – From project root, `cd admin && npm install && cp .env.local.example .env.local` (fill keys), then `npm run dev`; open http://localhost:3001.
4. **Mobile** – `cd mobile && flutter create . && flutter pub get && flutter run` (with Flutter installed).

---

## What to do next

Do these in order:

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com), sign up or log in, and create a new project.
   - In **SQL Editor**, open the file `supabase/migrations/00001_shahmaran.sql` on your computer, **copy all of its contents** (the SQL code), paste into the SQL Editor, and run it. Do not paste the file path—only the SQL inside the file.
   - In **Settings → API**, copy your **Project URL** and **anon public** key (and **service_role** key for the admin app).

2. **Connect the web Shahmaran page**
   - Open `js/shahmaran/config.js` and set `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY` to your project URL and anon key.
   - Open `index.html` or `shahmaran.html` in a browser (or use a local static server). Click **Shahmaran** to see the page; topics will load once you add data.

3. **Run the admin dashboard**
   - Install Node.js if you don’t have it ([nodejs.org](https://nodejs.org)).
   - In terminal: `cd admin`, then `npm install`.
   - Copy `admin/.env.local.example` to `admin/.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
   - Run `npm run dev` and open http://localhost:3001 to manage topics and steps.

4. **Add content**
   - Use the admin app (or Supabase Dashboard → Table Editor) to add rows to `topics`, `topic_translations`, `steps`, and `step_translations`. Then refresh the Shahmaran page to see them.

5. **Set up the mobile app (when ready)**
   - Install [Flutter](https://docs.flutter.dev/get-started/install).
   - In terminal: `cd mobile`, then `flutter create .`, then `flutter pub get`.
   - Add your Supabase URL and anon key (e.g. via `--dart-define` or a config file), then run `flutter run` with a device or emulator.

6. **Back up with Git**
   - Run `git init`, then `git add .` and `git commit -m "Initial commit: site, Shahmaran, admin, Flutter, Supabase schema"`.
   - Create a repo on GitHub/GitLab, add the remote, and `git push`.
