# College Carnival Management System (CCMS)

A comprehensive, full-stack platform designed to streamline the management of college carnivals, events, and proshow registrations. Built with a modern tech stack, CCMS provides a seamless experience for both students and administrators.

## 🚀 Tech Stack

- **Backend:** Spring Boot, PostgreSQL (Neon DB), Spring Security (JWT), Maven
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Lucide React, Framer Motion
- **Database:** PostgreSQL (Cloud-hosted via Neon)

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **Java 17** or higher
- **Node.js** (v18+) & **npm**
- **Maven** (optional, as `mvnw` is included)

---

## 🏁 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ccms
```

### 2. Backend Setup
The backend is a Spring Boot application.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Configure environment variables:
    Create a `.env.properties` file in the `backend/` directory (you can use `.env.properties.example` as a template):
    ```properties
    PORT=8080
    DB_URL=your_postgresql_url
    DB_USER=your_db_username
    DB_PASS=your_db_password
    JWT_SECRET=your_base64_encoded_jwt_secret
    ```
3.  Run the backend server:
    ```bash
    ./mvnw spring-boot:run
    or
    mvn spring-boot:run
    ```
    The backend will start on `http://localhost:8080`.

### 3. Frontend Setup
The frontend is built with React and Vite.

1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Configure environment variables:
    Create a `.env` file in the `frontend/` directory (you can use `.env.example` as a template):
    ```env
    VITE_API_BASE_URL="http://localhost:8080"
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

---

## 📱 Features

- **Dynamic Dashboards:** Beautifully designed glassmorphic interfaces for Students and Admins.
- **Event Management:** Create, view, and register for various carnival events.
- **Proshow Registrations:** Dedicated module for high-profile performance registrations.
- **Secure Authentication:** JWT-based secure login and session management.
- **Responsive Design:** Fully responsive UI that works on all devices.
=======
# Introduction 
TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project. 

# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references
