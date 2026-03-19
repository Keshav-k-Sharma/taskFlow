# 🚀 TaskFlow

**A streamlined, role-based project management platform for secure task tracking, team management, and real-time analytics.**

[Live Demo](https://taskflow26.vercel.app) 
<!-- TODO: Add documentation link if external documentation exists -->

</div>

## 📖 Overview

TaskFlow is a robust, full-stack project management solution designed to enhance team collaboration and productivity. Built with Next.js for a dynamic frontend and Node.js for a powerful backend API, it offers a secure and intuitive platform for managing projects, tracking tasks, and monitoring team performance. With role-based access control, TaskFlow ensures that users interact with the system based on their permissions, providing a tailored experience for administrators, project managers, and team members. Its real-time dashboard analytics deliver actionable insights, making project oversight efficient and effective.

## ✨ Features

-   🎯 **Role-Based Access Control**: Secure user authentication and authorization with distinct roles (Admin, Project Manager, Member).
-   📝 **Task Management**: Create, assign, track, and update tasks with various statuses and priorities.
-   👥 **Team & User Management**: Organize teams, manage user accounts, and assign roles within projects.
-   📊 **Real-time Dashboard Analytics**: Visualize project progress, task distribution, and team performance through interactive dashboards.
-   🔒 **Secure Authentication**: Robust user authentication system, likely using JWT for secure API interactions.
-   ⚡ **Responsive User Interface**: Optimized for a seamless experience across desktop and mobile devices.
-   🔄 **RESTful API**: A well-structured backend API for efficient data management and interaction.
## 📁 Project Structure

```
taskFlow/
├── .gitignore
├── README.md
├── backend/                  # Node.js Express API
│   ├── node_modules/         # Backend dependencies
│   ├── src/                  # Backend source code
│   │   ├── controllers/      # Handle request logic
│   │   ├── models/           # Define database schemas (e.g., User, Project, Task)
│   │   ├── routes/           # Define API endpoints
│   │   ├── middleware/       # Authentication, error handling, etc.
│   │   └── utils/            # Utility functions
│   ├── .env.example          # Example environment variables
│   ├── package.json          # Backend dependencies and scripts
│   └── server.js             # Backend entry point (or similar, e.g., app.js)
└── frontend/                 # Next.js React Application
    ├── node_modules/         # Frontend dependencies
    ├── public/               # Static assets (images, fonts)
    ├── src/                  # Frontend source code (or `app/` for App Router)
    │   ├── app/              # Next.js App Router root (pages, layouts)
    │   ├── components/       # Reusable UI components
    │   ├── lib/              # Utility functions, API clients
    │   ├── styles/           # Global styles, Tailwind CSS config
    │   └── hooks/            # Custom React hooks
    ├── .env.example          # Example environment variables
    ├── next.config.js        # Next.js configuration
    ├── package.json          # Frontend dependencies and scripts
    ├── postcss.config.js     # PostCSS configuration (often for Tailwind)
    ├── tailwind.config.js    # Tailwind CSS configuration
    └── tsconfig.json         # TypeScript configuration
```
## 🖥️ Screenshots
<img width="1920" height="1080" alt="Screenshot 2026-03-18 183336" src="https://github.com/user-attachments/assets/a0835599-059c-42a5-9b8f-a2cc576b95e4" />
<img width="1920" height="1080" alt="Screenshot 2026-03-18 183345" src="https://github.com/user-attachments/assets/c4919883-0e70-4f69-af74-d74eeda6b966" />

<img width="1920" height="1080" alt="Screenshot 2026-03-18 183402" src="https://github.com/user-attachments/assets/c75f3282-2040-46cd-85d6-6fa5286ddaeb" />
<img width="1920" height="1080" alt="Screenshot 2026-03-18 183352" src="https://github.com/user-attachments/assets/c2b074da-573a-4eec-801b-a06ec3a0904a" />

## 🛠️ Tech Stack
<div align=center>


**Frontend:**

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Backend:**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**Database:**

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
<!-- Assumed from common Node.js stack. Verify with actual backend code. -->

**DevOps:**

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
</div>
## 📚 API Reference

The backend exposes a RESTful API to interact with the TaskFlow data.

### Authentication
The API likely uses **JSON Web Tokens (JWT)** for authentication.
-   Users register and log in to receive a JWT.
-   This token must be included in the `Authorization` header of subsequent requests (e.g., `Bearer <token>`).

### Endpoints
The backend typically organizes endpoints by resource (e.g., users, projects, tasks).

| Method | Endpoint                    | Description                                         | Authentication |

|:-------|:----------------------------|:----------------------------------------------------|:---------------|

| `POST` | `/api/auth/register`        | Register a new user.                                | None           |

| `POST` | `/api/auth/login`           | Log in and receive a JWT.                           | None           |

| `GET`  | `/api/users/me`             | Get current user's profile.                         | Required       |

| `GET`  | `/api/users/:id`            | Get a user by ID.                                   | Required       |

| `GET`  | `/api/projects`             | Retrieve all projects accessible to the user.       | Required       |

| `POST` | `/api/projects`             | Create a new project.                               | Required       |

| `GET`  | `/api/projects/:id`         | Retrieve a specific project.                        | Required       |

| `PUT`  | `/api/projects/:id`         | Update an existing project.                         | Required       |

| `DELETE`| `/api/projects/:id`        | Delete a project.                                   | Required       |

| `GET`  | `/api/projects/:projectId/tasks` | Get tasks for a specific project.               | Required       |

| `POST` | `/api/projects/:projectId/tasks` | Create a new task within a project.             | Required       |

| `GET`  | `/api/tasks/:id`            | Get a specific task.                                | Required       |

| `PUT`  | `/api/tasks/:id`            | Update a specific task.                             | Required       |

| `DELETE`| `/api/tasks/:id`           | Delete a task.                                      | Required       |
<!-- This is an illustrative list based on common project management features. Actual routes may vary. -->


## 🚀 Quick Start

Follow these steps to get TaskFlow up and running on your local machine.

### Prerequisites
-   **Node.js** (LTS version, e.g., v18.x or v20.x)
-   **npm** (comes with Node.js)
-   **MongoDB instance** (local or cloud-hosted, e.g., MongoDB Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Keshav-k-Sharma/taskFlow.git
    cd taskFlow
    ```

2.  **Backend Setup**
    Navigate to the `backend` directory and install dependencies:
    ```bash
    cd backend
    npm install
    ```

3.  **Frontend Setup**
    Navigate to the `frontend` directory and install dependencies:
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Environment setup**
    Both `backend` and `frontend` require environment variables. Create `.env` files in both directories:

    ```bash
    # In the `backend` directory:
    cp .env.example .env
    ```
    ```bash
    # In the `frontend` directory:
    cp .env.example .env
    ```

    **Configure your environment variables in each `.env` file:**

    *   **Backend (`backend/.env`):**
        ```ini
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/taskflow-db # Or your MongoDB Atlas URI
        JWT_SECRET=your_jwt_secret_key # Generate a strong, random key
        # Add any other backend specific environment variables (e.g., email service credentials)
        ```

    *   **Frontend (`frontend/.env`):**
        ```ini
        NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api # Must match your backend API URL
        # Add any other frontend specific environment variables
        ```

5.  **Database setup**
    Ensure your MongoDB instance is running. TaskFlow doesn't seem to have explicit migration scripts, but you might need to manually seed the database with initial user roles or data if necessary. The application will create collections as data is inserted.

### Running the Application

1.  **Start the Backend Server**
    Open a new terminal, navigate to the `backend` directory, and start the server:
    ```bash
    cd backend
    npm run dev
    ```
    The backend API will typically run on `http://localhost:5000`.

2.  **Start the Frontend Development Server**
    Open another new terminal, navigate to the `frontend` directory, and start the Next.js development server:
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend application will typically run on `http://localhost:3000`.

3.  **Open your browser**
    Visit `http://localhost:3000` to access the TaskFlow application.



## ⚙️ Configuration

### Environment Variables
Both the frontend and backend applications rely on environment variables for sensitive data and configuration.

#### Backend (`backend/.env`)

| Variable      | Description                                       | Default             | Required |

|---------------|---------------------------------------------------|---------------------|----------|

| `PORT`        | Port for the backend server to listen on.         | `5000`              | Yes      |

| `MONGO_URI`   | Connection string for the MongoDB database.       | `(none)`            | Yes      |

| `JWT_SECRET`  | Secret key for signing and verifying JWTs.        | `(none)`            | Yes      |

| `NODE_ENV`    | Node.js environment mode (`development`, `production`). | `development` (in dev) | No       |

#### Frontend (`frontend/.env`)

| Variable                | Description                                        | Default             | Required |

|-------------------------|----------------------------------------------------|---------------------|----------|

| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the backend API calls.             | `http://localhost:5000/api` | Yes      |

| `NEXT_PUBLIC_APP_NAME`     | Publicly exposed application name.                 | `TaskFlow`          | No       |

### Configuration Files
-   **`next.config.js` (frontend):** Next.js specific configurations like image optimization, routing, and environment variables.
-   **`tailwind.config.js` (frontend):** Tailwind CSS configuration for customizing themes, colors, and utilities.
-   **`tsconfig.json` (frontend):** TypeScript compiler options for the Next.js project.
-   **`postcss.config.js` (frontend):** PostCSS configuration, typically used with Tailwind CSS.

## 🔧 Development

### Available Scripts
Each part of the application (`frontend` and `backend`) has its own `package.json` with scripts.

#### Frontend (`frontend/package.json`)

| Command       | Description                                  |

|---------------|----------------------------------------------|

| `npm run dev` | Starts the Next.js development server.       |

| `npm run build` | Creates a production-ready build of the app. |

| `npm run start` | Starts the Next.js production server.        |

| `npm run lint` | Runs ESLint to check for code quality issues. |

#### Backend (`backend/package.json`)

| Command       | Description                                   |

|---------------|-----------------------------------------------|

| `npm run dev` | Starts the backend server in development mode (often with `nodemon`). |

| `npm run start` | Starts the backend server in production mode. |

### Development Workflow
For development, you will typically run both the backend and frontend servers concurrently in separate terminal windows. Changes to either codebase will trigger hot-reloads/restarts for respective servers.

## 🧪 Testing

<!-- No explicit testing framework was detected at the top level. -->
<!-- TODO: Add specific testing instructions if Jest, React Testing Library, or other frameworks are used and configured. -->

For the frontend, you might find tests utilizing frameworks like [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/react/).
For the backend, common choices include [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/), or [Jest](https://jestjs.io/) for API endpoint and unit testing.

```bash

# Example: Run frontend tests

# cd frontend

# npm test

# Example: Run backend tests

# cd backend

# npm test
```

## 🚀 Deployment

### Production Build

**Frontend (Next.js):**
To create an optimized production build of the frontend application:
```bash
cd frontend
npm run build
```
The output will be generated in the `.next` directory.

**Backend (Node.js):**
To run the backend in a production environment:
```bash
cd backend
npm start
```
Ensure your `NODE_ENV` is set to `production` in the backend's `.env` file for optimal performance and security.

### Deployment Options
-   **Frontend (Vercel):** The project's `homepage` indicates deployment on Vercel. You can deploy the `frontend` directory directly to Vercel for continuous deployment.
    [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2FKeshav-k-Sharma%2FtaskFlow&project-name=taskflow-frontend&repo-name=taskFlow-frontend)
-   **Backend:** For the Node.js backend, you can deploy to various cloud providers such as:
    -   **Heroku**
    -   **Render**
    -   **AWS EC2 / Elastic Beanstalk**
    -   **DigitalOcean Droplets**
    -   **Railway**
    -   **Docker:** If a `Dockerfile` were included, you could containerize and deploy with Docker.



