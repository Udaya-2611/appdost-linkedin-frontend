# appdost-linkedin-clone

A simple LinkedIn-like clone built with **HTML/CSS/JavaScript** (frontend) and **PHP + MySQL** (backend). Includes a **like** feature.

## What is included
- Static frontend pages: `index.html`, `feed.html`, `style.css`, `script.js`
- API endpoints in `/api` (PHP): `signup.php`, `login.php`, `add_post.php`, `fetch_posts.php`, `like.php`, `logout.php`
- `database.sql` to create the tables
- `api/db.php` reads DB connection from environment variables
- CORS enabled on API for easy frontend deployment elsewhere

## How it works (quick)
1. Deploy **frontend** (the static files) to **Vercel** (recommended).
2. Deploy **backend** (the `/api` PHP files) to any PHP-capable host (Render, Railway with PHP buildpack, or a shared PHP host). The backend needs a MySQL database (PlanetScale recommended).
3. In `script.js`, set `API_BASE` to your backend URL (e.g. `https://api.example.com/api`).

## Step-by-step deployment (beginner-friendly)

### 1) Create a MySQL database (PlanetScale recommended)
- Sign up at https://planetscale.com (free tier available).
- Create a database, then create a password/branch and get the connection details (host, username, password).
- Run the SQL in `database.sql` using the PlanetScale web UI or a client (or create tables via migration).

### 2) Deploy backend (PHP)
Option A (Render / Railway / any PHP host) - Recommended:
- Create a new service on Render selecting "Web Service", connect your GitHub repo, choose a PHP environment (or use a simple Dockerfile).
- Set environment variables: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` (as provided by your DB host).
- Deploy. Your endpoints will be at e.g. `https://<your-backend>/api/signup.php` etc.

Option B (shared PHP hosting):
- Upload the `/api` folder and files to your host, place them under `/api/` and set up DB credentials in environment or directly in `api/db.php` (not recommended to hardcode).

> Note: Vercel does not run PHP natively. Host the backend on a PHP host and host the frontend on Vercel.

### 3) Deploy frontend to Vercel
- Create a GitHub repo and push all files (including `/api` if you like). The frontend is static so Vercel will serve `index.html`.
- In `script.js` set `API_BASE` to your backend base URL (e.g. `https://your-backend.com/api`).
- Link the repo to Vercel and deploy (automatic).

### 4) Test
- Open the frontend URL from Vercel, sign up, log in, create posts, like posts.

## Environment variables
Set these in your backend host environment:
```
DB_HOST=...
DB_NAME=...
DB_USER=...
DB_PASS=...
```

## Notes & troubleshooting
- If CORS issues occur, ensure the backend allows requests from your frontend domain.
- If using PlanetScale, you may need to use a "Standard" branch and a connection string compatible with your host (no `root` user). PlanetScale may require TLS and specific connection options.
- This is intentionally simple (no JWT). Token is stored in `users.token` and used for auth in the `Authorization` header.

---
If you'd like, I can:
- Prepare a GitHub-ready repository (I can create the zip for you to upload), and
- Give step-by-step screenshots for creating PlanetScale DB and deploying backend to Render.
