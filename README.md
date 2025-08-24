⚽ Scout.kz

A football scouting platform for Kazakhstan, designed to connect players, parents, and scouts.
Players can create detailed profiles, upload videos, and showcase their skills. Scouts and coaches can explore players, rate them, and provide feedback — helping discover new football talent across the country.


🛠 Tech Stack

Backend: Node.js, Express.js, PostgreSQL, Cloudinary, JWT, Multer
Frontend: React.js, React Router, Tailwind CSS, Axios
Database: PostgreSQL (local or Supabase/Heroku/Railway)
Deployment: Railway/Render/Heroku (backend), Vercel/Netlify (frontend)


📱 Features

Player & Scout authentication (JWT)

Player profile creation & editing

Video upload to Cloudinary (100MB limit)

Ratings system (Speed, Dribbling, Passing, Shooting, Defending)

Advanced player search (city, position, age)

Role-based access: Player, Parent, Scout, Admin (future)

Responsive Tailwind UI

📡 API Endpoints

Auth

POST /auth/register – Register user

POST /auth/login – Login user

Players

POST /players/profile – Create profile

GET /players/:id – Get player details

GET /players – List players with filters

Videos

POST /videos/upload – Upload video

GET /videos/player/:id – Get player videos

Ratings

POST /ratings – Add rating

GET /ratings/player/:id – Get ratings



🔐 Security Features

JWT authentication

Password hashing (bcrypt)

Request rate limiting

Input validation with Joi

SQL injection prevention

Secure file upload validation

Helmet security headers

🧩 Troubleshooting

413 Payload Too Large:

Check Cloudinary file size limits

Use eager_async=true for large uploads

Invalid Integer Error:

Ensure correct data types in DB (age, height, etc. must be integers)

Frontend Build Not Showing Styles:

Check tailwind.config.js content paths

Ensure index.css includes Tailwind directives

📈 Future Enhancements

AI-based video analysis

Player comparison tools

Tournament management

Mobile app (React Native)

Payment integration & subscriptions

Multi-language support

📞 Support & Resources

PostgreSQL Docs

Express.js

React

Tailwind CSS

Cloudinary
