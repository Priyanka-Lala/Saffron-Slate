# Saffron & Slate

A full-stack recipe website: React + TypeScript frontend (your original Figma Make design, untouched) with a real Node.js + Express + MongoDB backend behind it.

```
saffron-slate/
├── frontend/     ← the website you already designed — no visual changes were made
└── backend/      ← new: the API + database that powers it
```

---

## 1. What you'll need installed first

- **Node.js** version 18 or later — check with `node --version`. [Download here](https://nodejs.org) if needed.
- **MongoDB** — pick ONE of these two options:
  - **Option A (easiest to start): MongoDB Atlas** — a free cloud database, no local install needed.
    1. Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and create a free account.
    2. Create a free "M0" cluster (takes ~3 minutes to spin up).
    3. Under **Database Access**, create a database user with a username/password.
    4. Under **Network Access**, click "Allow Access from Anywhere" (fine for development).
    5. Click **Connect → Drivers**, copy the connection string (looks like `mongodb+srv://<user>:<password>@cluster0....mongodb.net/`).
    6. You'll paste this into `backend/.env` in step 3 below.
  - **Option B: Install MongoDB locally.** Follow the [official install guide](https://www.mongodb.com/docs/manual/administration/install-community/) for your OS, then make sure it's running (`mongod`).

---

## 2. Install dependencies

Open two terminal windows/tabs — one for the backend, one for the frontend.

**Terminal 1 — backend:**
```bash
cd backend
npm install
```

**Terminal 2 — frontend:**
```bash
cd frontend
npm install
```

---

## 3. Configure environment variables

**Backend** — copy the example file and fill in your MongoDB connection string:
```bash
cd backend
cp .env.example .env
```
Open `backend/.env` in a text editor:
- `MONGODB_URI` → paste your Atlas connection string (Option A) or leave the local default (Option B): `mongodb://127.0.0.1:27017/saffron-slate`
- `JWT_SECRET` → replace with a random string. You can generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- Leave `PORT`, `JWT_EXPIRES_IN`, and `FRONTEND_URL` as-is unless you have a reason to change them.

**Frontend** — this one's optional; it already defaults to `http://localhost:4000`:
```bash
cd frontend
cp .env.example .env
```

---

## 4. Seed the database (adds your 8 sample recipes + a login you can use immediately)

```bash
cd backend
npm run seed
```

You should see output ending with something like:
```
✅ Seed complete!

Log in with:
  Email:    demo@saffronandslate.com
  Password: password123
```

This is safe to re-run any time — it always wipes and rebuilds from scratch, so you can use it to reset to a clean state.

---

## 5. Run it

**Terminal 1 — start the backend:**
```bash
cd backend
npm run dev
```
You should see:
```
✅ Connected to MongoDB
🚀 Saffron & Slate API running at http://localhost:4000
```

**Terminal 2 — start the frontend:**
```bash
cd frontend
npm run dev
```
This will print a local URL — usually `http://localhost:5173`. Open it in your browser.

Log in with the demo account printed by the seed script (`demo@saffronandslate.com` / `password123`), or click "Create one for free" to sign up your own account.

---

## How it's organized (for when you want to change something)

### Backend (`backend/src/`)
```
config/db.ts           → connects to MongoDB
models/                → the shape of your data (User, Recipe)
controllers/            → the actual logic for each API endpoint
routes/                 → maps URLs (e.g. POST /api/recipes) to controller functions
middleware/
  auth.ts               → checks the login token on protected routes
  upload.ts              → handles recipe photo / avatar file uploads
index.ts                → starts the server, wires everything together
seed.ts                  → the "reset to sample data" script from step 4
```

**The pattern for every feature is the same**: a request comes in → `routes/` sends it to the right function in `controllers/` → that function talks to a `models/` schema to read/write MongoDB → sends a JSON response back. If you want to see how login works end-to-end, read (in this order): `routes/authRoutes.ts` → `controllers/authController.ts` → `models/User.ts`.

### Frontend (`frontend/src/`)
```
api/                    → all the code that talks to the backend (new)
context/AuthContext.tsx  → tracks who's logged in, across the whole app (new)
pages/                    → one file per screen — same as before, now wired to real data
components/                → shared pieces (nav bar, footer, recipe card) — unchanged visually
data.ts                    → still defines the shared TypeScript types (Recipe, Page, etc.)
```

Nothing in `components/Icons.tsx`, any CSS/Tailwind classes, or the visual layout of any page was touched — only the data source (mock arrays → real API calls) and form submit handlers changed.

---

## What's built vs. what's not (be aware of these before you show this to anyone)

**Fully working:**
- Sign up / log in / log out, with sessions that persist across page refreshes
- Browsing, searching, and filtering recipes
- Publishing a new recipe with a photo
- Favoriting/unfavoriting recipes
- Editing your profile (name, username, bio, location, avatar)
- Changing your password
- Notification, privacy, and dietary preference settings
- Deleting your account

**Intentionally stubbed / not built (by your earlier choices, or out of scope for now):**
- **"Continue with Google"** — the button is visibly disabled ("coming soon"). Wiring up real Google login requires registering the app with Google Cloud Console and adding OAuth handling — happy to do that in a follow-up if you want it.
- **"Forgot Password" emails** — the flow works, but instead of emailing a reset link, the backend just logs it to the terminal (`[forgot-password] Would send a reset link to ...`). Sending real emails needs a provider like SendGrid, Postmark, or AWS SES — that's a small addition if you want it next.
- **Changing your email address** — the field is shown but disabled in Edit Profile/Settings, since changing it safely should involve re-verifying the new address (another thing that needs email sending wired up first).
- **The Profile "Activity" tab** — shows a "coming soon" message rather than a fake activity feed. Building a real one means logging every publish/save/rating as it happens, which is a separate feature to design.
- **Uploaded images (recipe photos, avatars)** are stored on the backend server's local disk, in `backend/uploads/`. This is completely fine for development and even small real deployments — but if you ever move to a host with a temporary/ephemeral filesystem (many free hosting tiers), uploaded images would get wiped on restart. `backend/src/middleware/upload.ts` has notes on swapping this for a cloud storage bucket (e.g. AWS S3, Cloudinary) when you're ready — the rest of the app wouldn't need to change.

None of these were things I could silently paper over without you knowing, so wanted them written down plainly rather than have you discover them later.

---

## A few things worth knowing about how it works

- **Passwords** are never stored in plain text — they're hashed with bcrypt before touching the database.
- **Login sessions** use JWTs (JSON Web Tokens) stored in your browser's localStorage. This is the simplest approach to understand and is fine for a project like this; for a production app with stricter security needs, the more hardened approach is to store the token in an httpOnly cookie instead — worth revisiting if this ever goes fully live to the public.
- **The `npm run seed` script is destructive** — it deletes all existing users and recipes before adding the sample data back. Don't run it against a database with real user data you want to keep.

---

## If something doesn't work

- **Backend won't connect to MongoDB** — double check `MONGODB_URI` in `backend/.env`. If using Atlas, make sure you replaced `<password>` in the connection string with your actual database user's password, and that your IP is allowed under Network Access.
- **Frontend shows a network error** — make sure the backend is running (`npm run dev` in the `backend` folder) before you use the frontend.
- **"Port already in use"** — something else is using port 4000 (backend) or 5173 (frontend). Either close that other program, or change `PORT` in `backend/.env` (and update `VITE_API_URL` in `frontend/.env` to match).
