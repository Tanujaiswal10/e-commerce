# Table Structure
CREATE TABLE inventory (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    stock INT NOT NULL
);

#  Inventory (Products) API Documentation

This document describes the APIs used to manage product inventory and retrieve stock levels:

Base URL
http:localhost:5050/api/v1

Resource URL
/inventory

# 1. Create Product (Admin Only)

Endpoint:
POST /create

Description:
Creates a new product and sets its initial stock level.
This API is accessible only to users with the `ADMIN` role.

Headers:
Authorization: Bearer <jwt_token>

Request Body:
json
{
  "name": "iPhone 15",
  "stock": 50
}

Success Response:
**201 Created**
json
{
  "id": 1,
  "name": "iPhone 15",
  "stock": 50
}

Error Responses:
400 Bad Request – Missing or invalid fields
401 Unauthorized – Token missing or invalid
403 Forbidden – Access denied


## 2. Get All Products (Stock Levels)

Endpoint:
GET /getAllProduct

Description:
Retrieves all products along with their current stock levels.

Success Response:
200 OK
json
[
  {
    "id": 1,
    "name": "iPhone 15",
    "stock": 50
  },
  {
    "id": 2,
    "name": "Samsung S24",
    "stock": 30
  }
]

Error Responses:
500 Internal Server Error – Server error

## 3. Get Product by ID

Endpoint:
GET /getProduct/:id

Description:
Retrieves details and current stock of a specific product by its ID.
Used during order creation to validate stock availability.

Success Response:
200 OK
json
{
  "id": 1,
  "name": "iPhone 15",
  "stock": 50
}

Error Responses:
404 Not Found – Product not found


## Notes:

 Stock is **not updated directly** through an API
 Stock updates occur internally during:
  * Order placement
  * Order cancellation
Concurrent stock updates are handled at the database/order logic level

