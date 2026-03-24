# 🌉 TalentBridge — Job Portal Website

A full-stack Job Portal web application built with **React + Vite** (frontend) and **Django + SQLite** (backend).  
Designed as a modern, professional college project inspired by LinkedIn Jobs and Internshala.

---

## 📁 Project Structure

```
jobportal/
├── frontend/                    # React + Vite app
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── DashboardSidebar.jsx
│   │   │   └── ResumeUpload.jsx
│   │   ├── pages/               # Route-level pages
│   │   │   ├── Home.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ApplicantDashboard.jsx
│   │   │   └── CompanyDashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js           # Axios API layer
│   │   │   └── mockData.js      # Mock data for development
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/                     # Django REST API
    ├── jobportal/               # Project config
    │   ├── settings.py
    │   └── urls.py
    ├── users/                   # Auth + profiles app
    │   ├── models.py            # User, CompanyProfile, ApplicantProfile
    │   ├── serializers.py
    │   ├── views.py
    │   ├── urls.py
    │   └── admin.py
    ├── jobs/                    # Jobs CRUD app
    │   ├── models.py            # Job model
    │   ├── serializers.py
    │   ├── views.py
    │   ├── urls.py
    │   └── admin.py
    ├── applications/            # Applications app
    │   ├── models.py            # Application model
    │   ├── serializers.py
    │   ├── views.py
    │   ├── urls.py
    │   └── admin.py
    ├── media/resumes/           # Uploaded resumes stored here
    ├── manage.py
    └── requirements.txt
```

---

## 🚀 Getting Started

### Phase 1 — Run the Frontend (with Mock Data)

```bash
cd jobportal/frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

**Demo login credentials:**
| Role      | Email                  | Password   |
|-----------|------------------------|------------|
| Applicant | arjun@email.com        | password   |
| Company   | priya@techcorp.in      | password   |

---

### Phase 2 — Run the Django Backend

```bash
cd jobportal/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Seed sample data
python manage.py seed_data

# Create superuser (optional — seed_data creates one automatically)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend runs at **http://localhost:8000**

Django Admin: **http://localhost:8000/admin**  
Admin credentials (after seed): `admin@talentbridge.in` / `admin123`

---

### Phase 3 — Connect Frontend to Backend

1. Create a `.env` file in `frontend/`:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

2. Update `src/context/AuthContext.jsx`:
   - Replace the mock `login()` function with real API calls using `authAPI.login()` from `src/services/api.js`

3. Update each page/component to use `api.js` instead of `mockData.js`

---

## 🔌 API Reference

### Authentication
| Method | Endpoint              | Description              | Auth Required |
|--------|-----------------------|--------------------------|---------------|
| POST   | `/api/register/`      | Register new user        | ❌             |
| POST   | `/api/login/`         | Login, get JWT tokens    | ❌             |
| GET    | `/api/profile/`       | Get current user profile | ✅             |
| PUT    | `/api/profile/`       | Update profile           | ✅             |
| POST   | `/api/profile/resume/`| Upload resume            | ✅ Applicant   |

### Jobs
| Method | Endpoint                  | Description               | Auth Required |
|--------|---------------------------|---------------------------|---------------|
| GET    | `/api/jobs/`              | List jobs (with filters)  | ❌             |
| GET    | `/api/jobs/<id>/`         | Job detail                | ❌             |
| POST   | `/api/jobs/create/`       | Post a new job            | ✅ Company     |
| PUT    | `/api/jobs/<id>/manage/`  | Update job                | ✅ Company     |
| DELETE | `/api/jobs/<id>/manage/`  | Delete job                | ✅ Company     |
| GET    | `/api/jobs/mine/`         | Company's own jobs        | ✅ Company     |

### Applications
| Method | Endpoint                          | Description              | Auth Required |
|--------|-----------------------------------|--------------------------|---------------|
| POST   | `/api/jobs/<id>/apply/`           | Apply for a job          | ✅ Applicant   |
| GET    | `/api/applications/`              | My applications          | ✅ Applicant   |
| GET    | `/api/jobs/<id>/applicants/`      | Job's applicants         | ✅ Company     |
| PATCH  | `/api/applications/<id>/`         | Update status            | ✅ Company     |

### Job List Filter Parameters
```
GET /api/jobs/?title=react&location=bangalore&job_type=Full-time&category=Technology&salary_min=1000000&page=1
```

---

## 🎨 Frontend Features

- **Landing Page** — Hero, job search bar, featured jobs, company logos, features section, CTA
- **Job Listings** — Real-time filtering (type, category, location, salary), pagination, grid/list toggle
- **Job Details** — Full description, requirements, skills, apply modal with cover letter + resume upload
- **Authentication** — Login + Register with role selection (Applicant / Company), form validation
- **Applicant Dashboard** — Stats, application tracking, resume upload, profile editor
- **Company Dashboard** — Post jobs, manage listings, view applicants table, update status
- **Fully Responsive** — Works on mobile, tablet and desktop

---

## 🛠 Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS (custom design system)
- React Router v6
- React Hook Form (validation)
- Axios (API calls)
- Lucide React (icons)
- Google Fonts: Plus Jakarta Sans + DM Sans

### Backend
- Django 4.2
- Django REST Framework
- Simple JWT (access + refresh tokens)
- Django CORS Headers
- SQLite (development database)
- Django Admin Panel

---

## 📊 Database Models

```
User            → id, name, email, password, role, phone, bio, date_joined
CompanyProfile  → user(FK), company_name, description, website, logo, industry
ApplicantProfile→ user(FK), resume, skills, experience_years, portfolio_url
Job             → id, company(FK), title, description, location, salary, job_type, category, skills, openings
Application     → id, job(FK), applicant(FK), resume, cover_letter, status, applied_at
```

---

## ✅ Checklist

- [x] User Registration (Applicant + Company roles)
- [x] JWT Login / Logout
- [x] Post Jobs (Company)
- [x] Edit / Delete Jobs (Company)
- [x] Browse & Search Jobs (public)
- [x] Filter by type, category, location, salary
- [x] Apply for Jobs with cover letter + resume
- [x] Applicant Dashboard — application tracking
- [x] Company Dashboard — applicants table + status updates
- [x] Resume Upload (PDF/DOCX, max 5MB)
- [x] Django Admin Panel
- [x] Fully Responsive UI
- [x] Mock data for frontend-only development
- [x] Seed command for quick backend setup

---

*Built as a college project — feel free to extend with features like email notifications, saved jobs, or advanced search.*
