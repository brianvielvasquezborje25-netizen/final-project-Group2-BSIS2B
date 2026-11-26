 <div align="center">

# BU Hangout — Backend Implementation

**RESTful API and Database Integration**

*Server-side implementation for Bicol University Polangui's Integrated Food Stall Directory and Digital Menu System*

<p>
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
<img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
</p>

`Bicol University - Polangui` | `Backend Module` | `REST API`

</div>

---

## Overview

This repository contains the backend implementation for **BU Hangout**, an integrated web application developed for **Bicol University Polangui**.

The backend provides RESTful API endpoints that allow the frontend application to communicate with the database. It handles user authentication, user management, food stall information, and digital menu operations.

The system uses **Node.js and Express.js** to handle server-side operations, while **MongoDB Atlas and Mongoose** manage database storage and communication.

---

## What Was Implemented

| Component | File / Path | Implementation Details |
| :--- | :--- | :--- |
| **Server Configuration** | `server.js` | Initializes the Express server, configures middleware, registers API routes, and starts the backend application. |
| **Database Connection** | `/config/db.js` | Handles the connection between the backend application and MongoDB using Mongoose. |
| **Authentication Controller** | `/Controllers/Authcontroller.js` | Handles user login and authentication-related operations. |
| **User Controller** | `/Controllers/Usercontroller.js` | Handles user-related operations, including retrieving, creating, updating, and deleting users. |
| **Stall Controller** | `/Controllers/Stallcontroller.js` | Handles food stall management and CRUD operations. |
| **Menu Controller** | `/Controllers/Menucontroller.js` | Handles digital menu operations, including retrieving, filtering, adding, and updating menu items. |
| **Database Models** | `/Models/` | Defines the Mongoose schemas and models used to organize application data. |
| **API Routes** | `/Routes/` | Defines the HTTP endpoints that connect incoming API requests to their corresponding controllers. |
| **Environment Configuration** | `.env` | Stores environment variables such as the server port and MongoDB connection URI. |

---

## Routes Implemented

The backend provides the following REST API endpoints:

### 1. Authentication Routes

**File:** `Routes/Authroutes.js`

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticates a user using their login credentials. |

### 2. User Routes

**File:** `Routes/Userroutes.js`

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users` | Retrieves all registered users. |
| `POST` | `/api/users` | Creates a new user. |
| `PUT` | `/api/users/:id` | Updates an existing user using their ID. |
| `DELETE` | `/api/users/:id` | Deletes a user using their ID. |

### 3. Stall Routes

**File:** `Routes/Stallroutes.js`

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/stalls` | Retrieves all registered food stalls. |
| `POST` | `/api/stalls` | Creates a new food stall. |
| `PUT` | `/api/stalls/:id` | Updates an existing food stall using its ID. |
| `DELETE` | `/api/stalls/:id` | Deletes a food stall using its ID. |

### 4. Menu Routes

**File:** `Routes/Menuroutes.js`

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/menu` | Retrieves all menu items. |
| `GET` | `/api/menu?stallId=ID` | Retrieves menu items belonging to a specific stall. |
| `POST` | `/api/menu/add` | Adds a new menu item. |
| `PUT` | `/api/menu/:id` | Updates an existing menu item using its ID. |

**Note:** The currently implemented menu routes do not include a DELETE endpoint.

### 5. Server Status Route

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Checks whether the backend API server is running. |

Expected response:

```text
API is running successfully!
```

---

## Current Database Models

The backend currently contains three Mongoose models located inside the `Models/` directory.

| Model | File | Purpose |
| :--- | :--- | :--- |
| **User** | `User.js` | Represents registered users and stores user account information used by the authentication and user management features. |
| **Stall** | `Stall.js` | Represents food stalls registered in the application and stores their corresponding stall information. |
| **Menu Item** | `Menuitem.js` | Represents individual food products and menu entries associated with food stalls. |

These models provide the database structure used by the backend controllers when performing database operations through Mongoose.

---

## Database Connection Setup

BU Hangout uses **MongoDB Atlas** as its cloud database and **Mongoose** to establish communication between MongoDB and the Node.js application.

### Connection Architecture

```text
Frontend Application
        |
        | HTTP Requests
        v
   Express.js Server
      (server.js)
        |
        v
    API Routes
        |
        v
   Controllers
        |
        v
   Mongoose Models
        |
        v
  config/db.js
        |
        v
   MongoDB Atlas
```

### Environment Variables

The backend uses a `.env` file to store configuration values required by the application.

Create a `.env` file inside the `Backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
```

**Important:** Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas connection URI.

Do not upload your actual `.env` credentials to a public GitHub repository.

### Database Configuration

The `config/db.js` file is responsible for establishing the MongoDB connection through Mongoose.

The connection URI is retrieved from the environment variables using `process.env.MONGODB_URI`.

The database connection is initialized when the backend server starts.

---

## How to Run the Server Locally

Follow these steps to run the BU Hangout backend on your local machine.

Open VS Code and open the package,json in the Backend Folder
Open terminal and type npm install
After installing type npm start
