# DevOps Unified Dashboard

A professional web-based application built with the MERN stack to centralize and simplify DevOps tool management.

## Features

- **GitHub Integration**: Monitor repositories, stars, forks, and issues.
- **Jenkins Integration**: View pipeline statuses and trigger builds.
- **Docker Integration**: Manage containers (Start/Stop) and view stats.
- **Analytics**: Visual insights into commits, builds, and container usage.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Recharts, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running locally (or update `MONGO_URI` in `server/.env`)

### Installation

1.  **Install Dependencies**:
    ```bash
    npm run install-all
    ```
    (Or install manually in root, `server`, and `client` directories)

2.  **Environment Variables**:
    - Create a `.env` file in the `server` directory.
    - Add `MONGO_URI=mongodb://localhost:27017/devops-dashboard` (or your Atlas URI).
    - Add `PORT=5000`.

### Running the Application

1.  **Start both Server and Client**:
    ```bash
    npm start
    ```

    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:5000`

## Project Structure

- `client/`: React frontend application
- `server/`: Node.js/Express backend application
- `server/models/`: Mongoose models
- `server/controllers/`: Logic for handling requests
- `server/routes/`: API route definitions

## API Endpoints

- `GET /api/github/repos`: Get all repositories
- `GET /api/jenkins/pipelines`: Get all pipelines
- `GET /api/docker/containers`: Get all containers
