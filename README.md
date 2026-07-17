# Intervue

AI-powered interview platform that helps users practice and improve their interview skills.

## Features

- Resume upload and analysis
- AI-generated interview questions
- Real-time interview simulation
- AI-powered evaluation and feedback
- Performance tracking and analytics

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form + Zod

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose

### AI
- Gemini API

## Project Structure

```
Intervue/
├── client/          # Next.js frontend
├── server/          # Express.js backend
├── docs/            # Documentation
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Intervue
```

2. Install frontend dependencies
```bash
cd client
npm install
```

3. Install backend dependencies
```bash
cd ../server
npm install
```

4. Set up environment variables

Create `.env` files in both `client/` and `server/` directories.

5. Start development servers

Frontend:
```bash
cd client
npm run dev
```

Backend:
```bash
cd server
npm run dev
```

## API Documentation

API documentation will be available at `/api/docs` when the server is running.

## License

MIT
