# Node Authentication Project [node-auth]

Welcome to the Node Authentication Project documentation. This project provides a secure authentication system using Node.js, Express.js, and React.js.

## Quick Start

To quickly get started with the project, follow these simple steps:

### 1. Clone the Git Repository

```bash
git clone https://github.com/suyogsatyal/node-auth.git

```

### 2. Install Dependencies

Navigate to the project directory and run the following command to download the needed dependencies:

```bash
npm install
```

### 3. Run Frontend Server

Navigate to the project directory and run the following command to start the frontend server.

```bash
npm run frontend
```

This command initiates the frontend server, and you can access the frontend at <http://localhost:5173> by default.

### 4. Run Backend Server

Open a new terminal window, navigate to the project directory, and run the following command to start the backend server:

```bash
npm run backend
```

This command initiates the backend server, and you can access the frontend at <http://localhost:3000> by default.

## Folder Structure

Folder Structure of the project so far

```Folder Structure
.node-auth
├── backend
|   ├── routes
|   |   ├── authRoutes.ts
|   |   └── usersRoutes.ts
|   ├── .env
|   └── server.ts
├── db
|   └── database.db
├── frontend
|   ├── src
|   |   ├── components
|   |   |   └── Context.tsx
|   |   |       └── Navbar.tsx
|   |   ├── pages
|   |   |   ├── Login.tsx
|   |   |   └── Signup.tsx
|   |   ├── App.tsx
|   |   ├── index.css
|   |   └── main.tsx
|   ├── .env
|   └── index.html
└── utils
    ├── interface.ts
    └── schema.ts
```
