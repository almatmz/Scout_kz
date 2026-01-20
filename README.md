# Scout.kz - Football Talent Discovery Platform

<div align="center">

**A modern web platform connecting football players, scouts, and coaches in Kazakhstan**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

## Overview

Scout.kz is a comprehensive **football talent discovery platform** designed for the Kazakhstan market. It bridges the gap between aspiring football players and professional scouts/coaches.

### What it does:

- **Connects Talent with Opportunity** - Players showcase their skills, scouts find the next star
- **Video Portfolios** - Upload and share match highlights and training videos
- **Professional Ratings** - Scouts evaluate players across multiple skill categories
- **Smart Search** - Find players by position, location, age, and skill level

---

## Features

### User Roles & Access Control

| Role       | Capabilities                                                    |
| ---------- | --------------------------------------------------------------- |
| **Player** | Create profile, upload videos (max 5), view ratings             |
| **Scout**  | Browse players, rate skills, search/filter, view detailed stats |
| **Coach**  | Same as Scout + manage team information                         |
| **Parent** | Create profiles for minors, monitor activity                    |
| **Admin**  | Full system access, user management _(coming soon)_             |

### Core Functionality

**Authentication & Authorization**

- JWT-based secure authentication
- Phone number + Email dual login
- Password encryption with bcrypt (12 rounds)
- Role-based access control (RBAC)
- Persistent sessions with auto-login

  **Player Management**

- Comprehensive profiles (age, height, weight, position)
- Physical attributes tracking
- Club and experience history
- Bio and personal information
- Profile completion progress

  **Video Upload System**

- Cloudinary CDN integration
- Up to 5 videos per player
- Max 500MB per video
- Automatic video optimization
- Format validation (MP4, AVI, MOV, etc.)
- Upload progress tracking

  **Rating & Evaluation**

- 5-category skill assessment:
  - Speed ⚡
  - Dribbling 🏃
  - Passing 🎯
  - Shooting ⚽
  - Defending 🛡️
- Overall rating (1-10 scale)
- Text comments and feedback
- Rating history tracking
- Average rating calculation

  **Search & Discovery**

- Advanced filters (city, position, age range)
- Real-time search
- Sort by rating/date
- Pagination support (20 players per page)
- Player statistics overview

---

## Tech Stack

### Backend

- **Node.js** (v18+) - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** (v15+) - Primary database
- **Cloudinary** - Video/image storage CDN
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Joi** - Input validation
- **Multer** - File upload handling

### Frontend

- **React** (v18) - UI library
- **React Router** (v6) - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library

### DevOps & Tools

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nodemon** - Development auto-reload
- **pg-admin** - Database management
- **Git** - Version control

---

## Installation

### Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** v15 or higher ([Download](https://www.postgresql.org/download/))
- **Docker Desktop** (optional, for containerized setup) ([Download](https://www.docker.com/products/docker-desktop/))
- **Git** ([Download](https://git-scm.com/))

---

## Option 1: Docker Setup (Recommended)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/Scout_kz.git
cd Scout_kz
```

### 2️⃣ Create Environment Files

**Root `.env` file:**

```env
NODE_ENV=development
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=Scout_kz
```

**Backend `.env` file (`backend/.env`):**

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@postgres:5432/Scout_kz
FRONTEND_URL=http://localhost:3000

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend `.env` file (`frontend/.env`):**

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3️⃣ Build and Run with Docker

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 4️⃣ Initialize Database

```bash
# Run migration inside Docker container
docker-compose exec backend npm run migrate
```

### 5️⃣ Access the Application

| Service      | URL                              | Description         |
| ------------ | -------------------------------- | ------------------- |
| Frontend     | http://localhost:3000            | React app           |
| Backend API  | http://localhost:5000/api        | REST API            |
| Health Check | http://localhost:5000/api/health | Server status       |
| PostgreSQL   | localhost:5432                   | Database (internal) |

### Docker Commands Reference

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build

# View running containers
docker-compose ps

# View logs (follow mode)
docker-compose logs -f

# Restart specific service
docker-compose restart backend

# Execute command in container
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres -d Scout_kz

# Remove all containers and volumes (DANGER: deletes data)
docker-compose down -v
```

---

## Option 2: Manual Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/Scout_kz.git
cd Scout_kz
```

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/Scout_kz
FRONTEND_URL=http://localhost:3000

JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EOF
```

### 3️⃣ Create PostgreSQL Database

**Using psql:**

```bash
psql -U postgres
CREATE DATABASE Scout_kz;
\q
```

**Or using pgAdmin:**

1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name: `Scout_kz`
4. Click Save

### 4️⃣ Run Database Migration

```bash
# Still in backend folder
npm run migrate
```

You should see:

```
📦 Creating tables...
✅ Users table created
✅ Players table created
✅ Videos table created
✅ Ratings table created
📊 Creating indexes...
✅ Indexes created
🎉 Database migration completed successfully!
```

### 5️⃣ Start Backend Server

```bash
npm run dev
```

Expected output:

```
✅ Server running on port 5000
✅ Environment: development
```

### 6️⃣ Frontend Setup

Open a **new terminal** and run:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

The app will open at http://localhost:3000

---

## Project Structure

```
Scout_kz/
├── .env                              # Docker environment variables
├── docker-compose.yml                # Docker orchestration config
├── README.md                         # This file
│
├── backend/                          # Node.js/Express backend
│   ├── Dockerfile                    # Backend container config
│   ├── .env                          # Backend environment variables
│   ├── package.json                  # Dependencies
│   ├── server.js                     # Entry point
│   │
│   ├── config/                       # Configuration files
│   │   ├── database.js               # PostgreSQL connection
│   │   └── cloudinary.js             # Cloudinary setup
│   │
│   ├── controllers/                  # Request handlers
│   │   ├── auth.controller.js        # Authentication logic
│   │   ├── player.controller.js      # Player operations
│   │   ├── video.controller.js       # Video handling
│   │   └── rating.controller.js      # Rating management
│   │
│   ├── services/                     # Business logic
│   │   ├── auth.service.js
│   │   ├── player.service.js
│   │   ├── video.service.js
│   │   └── rating.service.js
│   │
│   ├── repositories/                 # Data access layer
│   │   ├── user.repository.js
│   │   ├── player.repository.js
│   │   ├── video.repository.js
│   │   └── rating.repository.js
│   │
│   ├── routes/                       # API endpoints
│   │   ├── auth.js                   # /api/auth/*
│   │   ├── players.js                # /api/players/*
│   │   ├── videos.js                 # /api/videos/*
│   │   └── ratings.js                # /api/ratings/*
│   │
│   ├── middleware/                   # Express middleware
│   │   ├── auth.js                   # JWT verification
│   │   ├── errorHandler.js           # Error handling
│   │   └── upload.js                 # File upload config
│   │
│   ├── validators/                   # Input validation schemas
│   │   ├── auth.schema.js
│   │   ├── player.schema.js
│   │   ├── rating.schema.js
│   │   └── video.schema.js
│   │
│   ├── utils/                        # Utility functions
│   │   ├── constants.js              # App constants
│   │   └── errors.js                 # Custom error classes
│   │
│   └── scripts/                      # Utility scripts
│       └── migrate.js                # Database migration
│
└── frontend/                         # React frontend
    ├── Dockerfile                    # Frontend container config
    ├── .env                          # Frontend environment variables
    ├── package.json                  # Dependencies
    │
    ├── public/                       # Static files
    │   ├── index.html
    │   └── favicon.ico
    │
    └── src/                          # React source code
        ├── App.js                    # Main app component
        ├── index.js                  # Entry point
        │
        ├── components/               # Reusable components
        │   ├── Navbar.js
        │   ├── AuthLayout.js
        │   ├── FormField.js
        │   ├── PasswordField.js
        │   └── RoleToggle.js
        │
        ├── pages/                    # Page components
        │   ├── Login.js
        │   ├── Register.js
        │   ├── PlayerDashboard.js
        │   ├── ScoutDashboard.js
        │   ├── PlayerProfile.js
        │   ├── VideoUpload.js
        │   └── PlayersListing.js
        │
        ├── contexts/                 # React contexts
        │   └── AuthContext.js        # Authentication state
        │
        ├── services/                 # API calls
        │   └── api.js                # Axios instance
        │
        └── styles/                   # CSS files
            └── index.css             # Tailwind imports
```

---

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Headers

Most endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

---

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "phone": "+77771234567",
  "email": "player@example.com",
  "password": "securepassword",
  "full_name": "Cristiano Ronaldo",
  "role": "player"
}
```

**Response (201 Created):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "phone": "+77771234567",
    "email": "player@example.com",
    "role": "player",
    "full_name": "Kylian Mbappe",
    "created_at": "2025-01-20T10:30:00.000Z"
  }
}
```

**Validation Rules:**

- `phone`: Must match pattern `+7XXXXXXXXXX` (10 digits after +7)
- `email`: Valid email format
- `password`: Minimum 6 characters
- `role`: One of: `player`, `parent`, `coach`, `scout`
- `full_name`: 2-100 characters

---

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "+77771234567",
  "password": "securepassword"
}
```

**Note:** `identifier` can be either phone number or email

**Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "phone": "+77771234567",
    "email": "player@example.com",
    "role": "player",
    "full_name": "Xabi Alonso",
    "created_at": "2025-01-20T10:30:00.000Z"
  }
}
```

---

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "id": 1,
  "phone": "+77771234567",
  "email": "player@example.com",
  "full_name": Jude Bellingham",
  "role": "player",
  "organization": null,
  "city": "Астана",
  "bio": "Футболист с опытом",
  "created_at": "2025-01-20T10:30:00.000Z"
}
```

---

#### Update Profile

```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Siuuu",
  "email": "newemail@example.com",
  "organization": "FC Astana",
  "city": "Астана",
  "bio": "Professional football player"
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "phone": "+77771234567",
  "email": "newemail@example.com",
  "full_name": "Алмат Муздыбай",
  "role": "player",
  "organization": "FC Astana",
  "city": "Астана",
  "bio": "Professional football player"
}
```

---

### Player Endpoints

#### Create/Update Player Profile

```http
POST /api/players/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "age": 22,
  "city": "Астана",
  "position": "Нападающий",
  "height": 180,
  "weight": 75,
  "preferred_foot": "Правая",
  "experience_years": 5,
  "club": "FC Astana",
  "bio": "Быстрый и техничный нападающий"
}
```

**Valid positions:** `Вратарь`, `Защитник`, `Полузащитник`, `Нападающий`  
**Valid preferred_foot:** `Левая`, `Правая`, `Обе`

**Response (201 Created or 200 OK):**

```json
{
  "message": "Профиль создан",
  "profile": {
    "id": 1,
    "user_id": 1,
    "age": 22,
    "city": "Астана",
    "position": "Нападающий",
    "height": 180,
    "weight": 75,
    "preferred_foot": "Правая",
    "experience_years": 5,
    "club": "FC Astana",
    "bio": "Быстрый и техничный нападающий",
    "created_at": "2025-01-20T10:35:00.000Z",
    "updated_at": "2025-01-20T10:35:00.000Z"
  }
}
```

---

#### Get My Player Profile

```http
GET /api/players/profile
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "id": 1,
  "user_id": 1,
  "age": 22,
  "city": "Астана",
  "position": "Нападающий",
  "height": 180,
  "weight": 75,
  "preferred_foot": "Правая",
  "experience_years": 5,
  "club": "FC Astana",
  "bio": "Быстрый и техничный нападающий",
  "full_name": "dsgsdf",
  "phone": "+77771234567",
  "created_at": "2025-01-20T10:35:00.000Z",
  "updated_at": "2025-01-20T10:35:00.000Z"
}
```

---

#### Get Player Statistics

```http
GET /api/players/me/stats
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "profileCompleted": true,
  "videosCount": 3,
  "averageRating": "8.5",
  "ratingsCount": 12
}
```

---

#### List All Players (Scout/Coach only)

```http
GET /api/players?city=Астана&position=Нападающий&age_min=18&age_max=25&page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**

- `city` (optional): Filter by city (partial match)
- `position` (optional): Exact position match
- `age_min` (optional): Minimum age
- `age_max` (optional): Maximum age
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Players per page

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "age": 22,
    "city": "Астана",
    "position": "Нападающий",
    "height": 180,
    "weight": 75,
    "preferred_foot": "Правая",
    "experience_years": 5,
    "club": "FC Astana",
    "full_name": "Vini jr",
    "avg_rating": "8.5",
    "rating_count": "12"
  }
]
```

---

#### Get Player by ID (Scout/Coach only)

```http
GET /api/players/:id
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "id": 1,
  "user_id": 1,
  "age": 22,
  "city": "Астана",
  "position": "Нападающий",
  "height": 180,
  "weight": 75,
  "preferred_foot": "Правая",
  "experience_years": 5,
  "club": "FC Astana",
  "bio": "Быстрый и техничный нападающий",
  "full_name": "real",
  "phone": "+77771234567",
  "avg_rating": "8.5",
  "rating_count": "12"
}
```

---

### Video Endpoints

#### Upload Video

```http
POST /api/videos/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

video: <file>
title: "Match highlights - FC Astana vs Kairat"
description: "Goals and assists from the match"
```

**Constraints:**

- Max file size: 500MB
- Max videos per player: 5
- Supported formats: video/\* (MP4, AVI, MOV, etc.)

**Response (201 Created):**

```json
{
  "message": "Видео успешно загружено",
  "video": {
    "id": 1,
    "player_id": 1,
    "title": "Match highlights - FC Astana vs Kairat",
    "description": "Goals and assists from the match",
    "video_url": "https://res.cloudinary.com/...",
    "cloudinary_id": "scout-kz/videos/abc123",
    "duration": 120,
    "file_size": 15728640,
    "created_at": "2025-01-20T11:00:00.000Z"
  }
}
```

---

#### Get My Videos

```http
GET /api/videos/my-videos
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "player_id": 1,
    "title": "Match highlights - FC Astana vs Kairat",
    "description": "Goals and assists from the match",
    "video_url": "https://res.cloudinary.com/...",
    "cloudinary_id": "scout-kz/videos/abc123",
    "duration": 120,
    "file_size": 15728640,
    "created_at": "2025-01-20T11:00:00.000Z",
    "updated_at": "2025-01-20T11:00:00.000Z"
  }
]
```

---

#### Get Player's Videos

```http
GET /api/videos/player/:playerId
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "player_id": 1,
    "user_id": 1,
    "full_name": "Алмат Муздыбай",
    "title": "Match highlights",
    "description": "Goals and assists",
    "video_url": "https://res.cloudinary.com/...",
    "created_at": "2025-01-20T11:00:00.000Z"
  }
]
```

---

#### Update Video

```http
PUT /api/videos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description"
}
```

**Response (200 OK):**

```json
{
  "message": "Видео обновлено",
  "video": {
    "id": 1,
    "title": "Updated title",
    "description": "Updated description",
    "video_url": "https://res.cloudinary.com/...",
    "updated_at": "2025-01-20T12:00:00.000Z"
  }
}
```

---

#### Delete Video

```http
DELETE /api/videos/:id
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "message": "Видео удалено"
}
```

---

### Rating Endpoints

#### Create/Update Rating (Scout/Coach only)

```http
POST /api/ratings
Authorization: Bearer <token>
Content-Type: application/json

{
  "player_id": 1,
  "speed": 8,
  "dribbling": 9,
  "passing": 7,
  "shooting": 8,
  "defending": 5,
  "overall_rating": 8,
  "comments": "Excellent technical skills, needs work on defending"
}
```

**Validation:**

- All skill ratings: 1-10
- Only one rating per scout per player (updates if exists)

**Response (201 Created or 200 OK):**

```json
{
  "message": "Оценка создана",
  "rating": {
    "id": 1,
    "player_id": 1,
    "rater_id": 2,
    "speed": 8,
    "dribbling": 9,
    "passing": 7,
    "shooting": 8,
    "defending": 5,
    "overall_rating": 8,
    "comments": "Excellent technical skills, needs work on defending",
    "created_at": "2025-01-20T13:00:00.000Z"
  }
}
```

---

#### Get Player's Ratings

```http
GET /api/ratings/player/:playerId
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "player_id": 1,
    "rater_id": 2,
    "rater_name": "Иван Петров",
    "rater_role": "scout",
    "speed": 8,
    "dribbling": 9,
    "passing": 7,
    "shooting": 8,
    "defending": 5,
    "overall_rating": 8,
    "comments": "Excellent technical skills",
    "created_at": "2025-01-20T13:00:00.000Z"
  }
]
```

---

#### Get My Ratings (Scout/Coach only)

```http
GET /api/ratings/my-ratings
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "player_id": 1,
    "player_name": "Алмат Муздыбай",
    "position": "Нападающий",
    "city": "Астана",
    "speed": 8,
    "dribbling": 9,
    "passing": 7,
    "shooting": 8,
    "defending": 5,
    "overall_rating": 8,
    "comments": "Excellent technical skills",
    "created_at": "2025-01-20T13:00:00.000Z"
  }
]
```

---

### Health Check

#### Server Health

```http
GET /api/health
```

**Response (200 OK):**

```json
{
  "status": "OK",
  "timestamp": "2025-01-20T14:00:00.000Z"
}
```
