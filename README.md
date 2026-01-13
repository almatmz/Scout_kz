# 🌍 Scout. kz

**A modern web platform for scouting talents and opportunities.**

---

## 🚀 Overview

Scout.kz is a **full-stack scouting platform** that connects players, scouts, and coaches.  
It provides tools for **profile creation, video uploads, ratings, and talent discovery**.

The system is built with a **Node+Express backend**, **PostgreSQL database**, and a **React + Tailwind CSS frontend**.

---

## 📱 Features Overview

### 👥 User Roles & Permissions

- **Player**: Create profile, upload videos, view ratings
- **Scout/Coach**: View players, rate players, search/filter
- **Admin**: Full access _(future feature)_

### ⚡ Core Functionality

✅ JWT-based authentication  
✅ Phone number registration/login  
✅ Player profile creation/editing  
✅ Video upload to **Cloudinary**  
✅ Rating system (1–10 scale)  
✅ Advanced search and filtering  
✅ Responsive design  
✅ Real-time feedback  
✅ File upload validation

---

## 🔌 API Endpoints

**Auth**

- `POST /auth/register` – User registration
- `POST /auth/login` – User login

**Players**

- `GET/POST /players/profile` – Player profile management
- `GET /players` – List players (with filters)
- `GET /players/: id` – Get specific player

**Videos**

- `POST /videos/upload` – Upload video
- `GET /videos/my-videos` – Get user's videos
- `GET /videos/player/:id` – Get player's videos

**Ratings**

- `POST /ratings` – Create/update rating
- `GET /ratings/player/:id` – Get player ratings

---

## 🛡️ Security Features

- 🔑 JWT token authentication
- 🔒 Password hashing with **bcrypt**
- 📝 Input validation with **Joi**
- ⏱️ Rate limiting
- 🌍 CORS configuration
- 🛡️ SQL injection prevention
- 📂 File upload validation
- 🪖 Helmet security headers

---

## 🛠 Local Development Setup

You can run Scout.kz either with **Docker** (recommended) or manually.

---

## 🐳 Option 1: Docker Setup (Recommended)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Local PostgreSQL with database `Scout_kz` (or use Docker PostgreSQL)

### 1. Clone the Repository

```bash
git clone https://github.com/almatmz/Scout_kz.git
cd Scout_kz
```

### 2. Create `.env` file in project root

```env
NODE_ENV=development
PORT=5000

# Database (use your local PostgreSQL credentials)
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# JWT
JWT_SECRET=
JWT_EXPIRE=7d

# Cloudinary (for video uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 3. Build and Run

```bash
# Build and start containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 7. Access the Application

| Service     | URL                       |
| ----------- | ------------------------- |
| Frontend    | http://localhost:3000     |
| Backend API | http://localhost:5000/api |

### Docker Commands Reference

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Rebuild and start
docker-compose up -d --build

# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend

# Execute command in container
docker-compose exec backend sh
```

---

## Option 2: Manual Setup

### 1. Clone the Repository

```bash
git clone https://github.com/almatmz/Scout_kz.git
cd Scout_kz
```

### 2. Backend Setup (/backend)

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file (in backend folder):

```env
PORT=5000
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRE=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Make sure the PostgreSQL database exists:

```bash
createdb Scout_kz
```

Start the backend server:

```bash
npm run dev
```

By default the API will be available at: http://localhost:5000

### 3. Frontend Setup (/frontend)

In a new terminal, go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file (in frontend folder):

```env
REACT_APP_API_BASE=http://localhost:5000
```

Start the React development server:

```bash
npm start
```

The app will be available at: http://localhost:3000

---

## 📁 Project Structure

```
Scout_kz/
├── . env                    # Docker environment variables
├── docker-compose.yml      # Docker Compose configuration
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── . env                # Backend environment variables (manual setup)
│   ├── package.json
│   ├── server.js
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── scripts/
│   └── uploads/
└── frontend/
    ├── Dockerfile
    ├── .env                # Frontend environment variables
    ├── package.json
    ├── public/
    └── src/
```

---

## Testing the Application

### 1. Register Users

- Go to `/register`
- Create a **player account**
- Create a **scout/coach account**

### 2. Create Player Profile

- Login as **player**
- Go to `/profile`
- Fill out profile information

### 3. Upload Videos

- Go to `/upload-video`
- Upload a video file (max **100MB**)
- Add title and description

### 4. Scout/Coach Features

- Login as **scout/coach**
- Go to `/players` to browse players
- Click on a player to view details
- Rate players using the **rating system**
- Filter players by **position, city, age**

---

## Key Features Explained

### Authentication System

- Phone number + password authentication
- JWT tokens with 7-day expiration
- Role-based access control
- Persistent login sessions

### Player Profile System

- Comprehensive profile with **physical stats**
- Position, experience, club information
- Bio section for personal description
- Real-time profile updates

### Video Upload System

- Cloudinary integration for **reliable storage**
- File size validation (100MB limit)
- Video format validation
- Max **2 videos per player**
- Progress tracking during upload

### Rating System

- 5 skill categories: **Speed, Dribbling, Passing, Shooting, Defending**
- Overall rating (1–10 scale)
- Comments section for detailed feedback
- Average rating calculation
- Rating history tracking

### Search & Filter System

- Text search by player name
- Filter by **city, position, age range**
- Real-time filtering
- Pagination support
- Sort by rating

## Available NPM Scripts

### Backend (/backend)

| Command       | Description                              |
| ------------- | ---------------------------------------- |
| `npm start`   | Start server in production mode          |
| `npm run dev` | Start server with nodemon (auto-restart) |
| `npm test`    | Run backend tests                        |

### Frontend (/frontend)

| Command         | Description             |
| --------------- | ----------------------- |
| `npm start`     | Start React dev server  |
| `npm run build` | Create production build |
| `npm test`      | Run frontend tests      |

---

## Environment Summary

| Service    | Local URL             | Port |
| ---------- | --------------------- | ---- |
| Frontend   | http://localhost:3000 | 3000 |
| Backend    | http://localhost:5000 | 5000 |
| PostgreSQL | localhost             | 5432 |
