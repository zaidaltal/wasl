# Wasl (وصل) — MENA Freelance Marketplace

> **Wasl** means "connection" in Arabic — connecting businesses with talented freelancers across Jordan and the Middle East.

## Tech Stack

| Layer    | Technology             |
|----------|------------------------|
| Frontend | Next.js 14 (TypeScript) |
| Backend  | PHP 8.0+ (REST API)    |
| Database | MySQL 8.0+             |
| Styling  | Tailwind CSS           |
| i18n     | next-intl (Arabic + English, RTL) |
| Auth     | JWT (firebase/php-jwt) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- PHP 8.0+ with Composer
- MySQL 8.0+
- Apache/Nginx (or PHP built-in server)

### 1. Database Setup

```bash
# Create database and run schema
mysql -u root -p < database/schema.sql

# Seed categories and demo data
mysql -u root -p < database/seeds/categories.sql
mysql -u root -p < database/seeds/demo_users.sql
```

### 2. Backend Setup

```bash
cd backend

# Copy env file and configure
cp .env.example .env
# Edit .env with your DB credentials and JWT secret

# Install PHP dependencies
composer install

# Start development server (XAMPP/WAMP recommended)
# Or use PHP built-in server:
php -S localhost:8000 -t public/
```

### 3. Frontend Setup

```bash
cd frontend

# Copy env file
cp .env.local.example .env.local
# Edit .env.local if needed

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) in your browser.

---

## Features

### Authentication
- Register as Freelancer or Client
- JWT-based authentication
- Role-based access control

### For Freelancers
- Complete profile with bio, skills, hourly rate
- Portfolio links management
- Browse and apply to jobs with cover letters
- Dashboard with application status tracking

### For Clients
- Company profile
- Post, edit, and manage job listings
- Review applicants and accept/reject applications
- Dashboard with job statistics

### Job Board
- Browse all open positions
- Search by keyword
- Filter by category, country
- Detailed job pages with application flow

### Admin Panel
- Platform statistics dashboard
- User management (view/remove)
- Job management (view/remove)
- Tab-based interface

### Design & UX
- Arabic (RTL) and English (LTR) fully supported
- Dark mode toggle
- Responsive for mobile and desktop
- Modern SaaS-style UI with Tailwind CSS

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/jobs` | List jobs |
| POST | `/api/jobs` | Create job |
| POST | `/api/jobs/:id/apply` | Apply to job |
| GET | `/api/freelancers/featured` | Featured freelancers |
| GET | `/api/categories` | All categories |
| GET | `/api/admin/stats` | Admin stats |

See [backend/public/index.php](backend/public/index.php) for full routing.

---

## Project Structure

```
wasl/
├── frontend/          # Next.js App (TypeScript)
│   ├── src/app/       # App Router pages
│   ├── src/components/# UI components
│   ├── src/lib/       # API client & utilities
│   └── public/locales/# i18n translations (en/ar)
├── backend/           # PHP REST API
│   ├── public/        # Entry point (index.php)
│   └── src/           # Controllers, Models, Middleware
└── database/          # SQL schema & seeds
```

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@wasl.jo | Admin@123 |

> Create freelancer/client accounts via the register page.

---

Built with ❤️ for the MENA region by the Wasl team.
