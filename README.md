# CRUD-Node.js

This is a simple CRUD (Create, Read, Update, Delete) application built using Node.js, Express.js, and PostgreSQL. It allows you to perform basic CRUD operations on a user table in a PostgreSQL database.

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (https://nodejs.org)
- PostgreSQL (https://www.postgresql.org)

Clone the repository:

   ```bash
   git clone https://github.com/your-username/crud-node.git
   ```  

## Getting Started With API

1. Install dependencies:

   ```bash
   cd crud-node
   cd api
   npm install
   ```

2. Set up the database:

   - Create a PostgreSQL database named "Node_CRUD".
   - Update the database connection settings in the `db.js` file.

3. Start the server:

   ```bash
   npm start
   ```

   The server will start running on `http://localhost:3001`.

## API Endpoints

The following API endpoints are available:

- `POST /users`: Create a new user.
- `GET /users`: Get all users.
- `GET /users/:id`: Get a user by ID.
- `PUT /users/:id`: Update a user by ID.
- `DELETE /users/:id`: Delete a user by ID.

## Getting Started With Frontend

1. Install dependencies:

   ```bash
   cd..
   cd client
   npm install
   ```
   
2. Start the server:

   ```bash
   npm run dev
   ```

   The server will start running on `http://localhost:3000`.

