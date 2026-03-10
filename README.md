# Academic City Arts, Media & Drama Club Portfolio

A modern portfolio website for the Academic City Arts, Media & Drama Club built with React, Vite, Tailwind CSS, and MongoDB.

## Features

- 🎭 Beautiful theatrical design with dramatic theme
- 📱 Fully responsive layout
- 🎨 Gradient animations and hover effects
- 📝 Contact form with MongoDB integration
- 🎬 Productions showcase
- 👥 Team member profiles
- 🖼️ Performance gallery

## Tech Stack

### Frontend
- React 19
- Vite 7
- Tailwind CSS 4
- Modern JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd drama-club
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env` file and update with your MongoDB connection string
   - For local MongoDB: `mongodb://localhost:27017/dramaclub`
   - For MongoDB Atlas: Get your connection string from Atlas dashboard

4. Start MongoDB (if using local installation):
```bash
mongod
```

5. Start the backend server:
```bash
npm run server
```

6. In a new terminal, start the frontend development server:
```bash
npm run dev
```

7. Open your browser and visit: `http://localhost:5173`

## Project Structure

```
drama-club/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images and media
│   ├── App.jsx      # Main application component
│   ├── App.css      # Application styles
│   ├── index.css    # Global styles with Tailwind
│   └── main.jsx     # Application entry point
├── server.js        # Express server with MongoDB
├── .env             # Environment variables (not committed)
├── package.json     # Dependencies and scripts
├── tailwind.config.js
└── vite.config.js
```

## Available Scripts

- `npm run dev` - Start frontend development server (Vite)
- `npm run server` - Start backend server with nodemon
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/dramaclub`

### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add database user and whitelist IP address
4. Get connection string and update `.env` file

## API Endpoints

### POST /api/contact
Submit contact form data
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "message": "I want to join the club!"
}
```

### GET /api/contacts
Retrieve all contact submissions (admin use)

### GET /api/health
Check server health status

## Customization

- Update club information in `src/App.jsx`
- Modify color scheme in Tailwind classes (current: red/yellow theatrical theme)
- Add actual production images in the Gallery section
- Update team member details in the Members section

## Deployment

### Vercel (Recommended) ⚡

This project is optimized for Vercel deployment with automatic environment variable configuration.

**Quick Deploy:**
1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Configure environment variables (see below)
4. Deploy!

**Detailed Instructions:** See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for step-by-step guide.

**Environment Variables for Production:**
```env
# Backend
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
BASE_URL=https://your-backend.vercel.app
WEBSITE_URL=https://your-frontend.vercel.app

# Frontend
VITE_API_URL=https://your-backend.vercel.app
```

### Alternative Deployment Options

**Frontend:**
- Vercel (recommended)
- Netlify
- GitHub Pages

**Backend:**
- Vercel Serverless Functions (configured via `vercel.json`)
- Railway
- Render
- Heroku

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Contact

For questions or support, please use the contact form on the website.

---

Made with ❤️ for the Academic City Arts, Media & Drama Club 🎭
