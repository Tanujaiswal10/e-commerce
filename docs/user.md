# Table Structure

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'CUSTOMER') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


# Users API Documentation
This document describes all user-related APIs, including registration, login, and user retrieval.

Base URL
http:localhost:5050/api/v1

Resource URL
/user

 ## 1. Create User / Admin
Endpoint
POST /create

Description:

Registers a new user or admin account.

Request Body
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "Password@123",
  "role": "CUSTOMER"
}
role can be CUSTOMER or ADMIN

Success Response:
201 Created
{
  "message": "User registered"
}

or
{
  "message": "Admin registered"
}

Error Responses:
400 Bad Request – Missing or invalid fields

## 2. Login User
Endpoint
POST /login

Description:

Authenticates a user and returns a JWT token.

Request Body
{
  "email": "john.doe@example.com",
  "password": "Password@123"
}

Success Response:
200 OK
{
  "token": "<jwt_token>",
  "id": 1
}

Error Responses:
401 Unauthorized – Invalid credentials

## 3. Get User by ID
Endpoint
GET /getUser/:id

Description:

Fetches user details by user ID.
This endpoint is protected.

Headers
Authorization: Bearer <jwt_token>

Success Response:
200 OK
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "CUSTOMER"
}

Error Responses:
401 Unauthorized – Token missing or invalid
404 Not Found – User not found

## 4. Get All Users (Admin Only)
Endpoint
GET /getAllUser

Description:

Returns a list of all users.
Accessible only by users with ADMIN role.

Headers
Authorization: Bearer <jwt_token>

Success Response:
200 OK
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "CUSTOMER"
  },
  {
    "id": 2,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
]
Error Responses:
401 Unauthorized – Token missing or invalid
403 Forbidden – Access denied

## Notes:
Passwords are stored as hashed values
JWT is required for protected routes
Role-based access control is enforced