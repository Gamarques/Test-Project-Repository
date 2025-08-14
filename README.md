# Test-Project-Repository

### Prerequisites
- [Bun](https://bun.sh/) installed
- Node.js (recommended for compatibility)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Gamarques/Test-Project-Repository.git
cd Test-Project-Repository
```

2. Install dependencies:
```bash
bun run install:all
```

### Setting up the Project
Create a .env file in the Backend folder based on .env.example:

`PORT=3000` 
`CORS_ORIGIN=http://localhost:5173`

- Note: Vite uses port 5173 by default. When initialize you can check URL on terminal. If you don't want to setup the frontend PORT, you can use `CORS_ORIGIN=*` to accept connections from any origin during development

Create a .env file in the Frontend folder based on .env.example:

`VITE_API_URL=http://localhost:3000/api/scrape`

### Running the Project

To start both the backend and frontend in development mode:

```bash
bun run dev
```

This will concurrently run:
- Backend: `cd backend && bun run dev`
- Frontend: `cd frontend && bun run dev`

### Building the Frontend

To build the frontend for production:

```bash
bun run build
```

This will run:
- Frontend: `cd frontend && bun run build`

### Starting the Production Build

To start the backend and serve the built frontend:

```bash
bun run start
```

This will concurrently run:
- Backend: `cd backend && bun run start`
- Frontend: `cd frontend && bun run preview`

## Project Structure
test-project-repository/
├── Backend/               # TypeScript Server
│   ├── index.ts          # Server entry point
│   └── .env              # Backend environment variables
│
├── Frontend/             # Vite Client
│   ├── src/             # Frontend source code
│   └── .env             # Frontend environment variables
│
└── package.json         # Project scripts and      dependencies

