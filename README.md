# Telegram Bot Web App

## Overview

This project is a web application that integrates with a Telegram Bot, providing user authentication, token verification, and profile management. It's built using Svelte for the frontend and Node.js with Express for the backend. The project follows Domain-Driven Design (DDD) principles to ensure a clear separation of concerns and maintainable code structure.


## Features

- User registration with Telegram ID
- Secure login system
- Token-based authentication
- User profile viewing
- Integration with Telegram Bot API

## Architecture

This project is structured following Domain-Driven Design (DDD) principles:

- **Domain Layer**: Contains the core business logic and entities.
- **Application Layer**: Orchestrates the flow of data between the outside world and the domain layer.
- **Infrastructure Layer**: Provides implementations for persistence and external services.
- **API Layer**: Handles HTTP requests and responses.

The use of DDD helps in:
- Maintaining a clear separation of concerns
- Ensuring that business logic is centralized and not scattered throughout the application
- Facilitating easier testing and maintenance
- Allowing the application to evolve with changing business needs

## Tech Stack

- Frontend: Svelte, TypeScript
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: TypeORM
- Authentication: JWT (JSON Web Tokens)
- API: Telegram Bot API
- Architecture: Domain-Driven Design (DDD)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v20 or later)
- npm (v6 or later)
- PostgreSQL (v16 or later)
- A Telegram Bot Token (obtain from BotFather on Telegram)

## Installation

1. Clone the repository:
```
git clone https://github.com/singhfinity/telegram-bot-webapp.git
cd telegram-bot-webapp
```

2. Install backend dependencies:
```
cd backend
npm install
```

3. Install frontend dependencies:
```
cd ../frontend
npm install
```

4. Set up environment variables:
Create a `.env` file in the `backend` directory with the following contents:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=db_username
DB_PASSWORD=db_password
DB_NAME=telegram_bot_webapp
JWT_SECRET=jwt_secret
TELEGRAM_BOT_TOKEN=telegram_bot_token
```
Replace the placeholders with your actual database credentials and Telegram Bot token.

5. Set up the database:
```
cd ../backend
npm run typeorm migration:run
```

## Running the Application

1. Start the backend server:
```
cd backend
npm run dev
```

2. In a new terminal, start the frontend development server:
```
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5000` (or the port specified by Vite).

## Usage

1. Sign Up:
   - Enter your Telegram ID and a password.
   - You'll receive an authorization token. Save this token securely.

2. Log In:
   - Use your Telegram ID and password to log in.
   - You'll be prompted to enter your authorization token.

3. View Profile:
   - After successful authentication, you can view your profile information.

4. Log Out:
   - Click the logout button to end your session.

## API Endpoints

- `POST /api/signup`: Register a new user
- `POST /api/login`: Authenticate a user
- `POST /api/verify-token`: Verify the user's authorization token and return a JWT
- `GET /api/user`: Get the current user's profile (protected route)
- `GET /api/user/:id`: Get a user's first name by their Telegram ID

## Testing

To run the test suite:

```
cd backend
npm test
```

## Deployment

For production deployment:

1. Build the frontend:
```
cd frontend
npm run build
```

2. Set the `NODE_ENV` to `production` in your backend `.env` file.

3. Use a process manager like PM2 to run the backend server:
```
pm2 start backend/dist/index.js
```

4. Serve the frontend build directory with a web server like Nginx.

## Docker

This project includes Dockerfiles for both frontend and backend, as well as a `docker-compose.yml` for easy deployment.

To run the application using Docker:

```
docker-compose up --build
```

## Acknowledgements

- [Svelte](https://svelte.dev/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeORM](https://typeorm.io/)
- [Telegram Bot API](https://core.telegram.org/bots/api)