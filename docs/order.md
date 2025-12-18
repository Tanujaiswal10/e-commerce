# Table Structure

CREATE TABLE orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  status ENUM('CREATED','CONFIRMED','CANCELLED') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  inventory_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL
);


# Orders API Documentation

This document describes all order-related APIs including order creation, retrieval, listing with pagination, filtering, and cancellation:

## Base URL


All endpoints are JWT protected.

# Order Status Flow
CREATED → CONFIRMED → CANCELLED
Payment is simulated
Inventory is rolled back if payment fails


## 1. Create Order

Endpoint:
POST /orders

Description:
Creates a new order for the logged-in customer.

1 Validates product stock
2 Reduces inventory
3 Simulates payment
4 Confirms or cancels order automatically

Headers:
Authorization: Bearer <jwt_token>

Request Body:

{
  "items": [
    {
      "inventory_id": 1,
      "quantity": 2
    }
  ]
}

Success Response (Payment Success):
201 Created
{
  "message": "Order confirmed",
  "orderId": 12
}
Failure Response (Payment Failed)
{
  "message": "Payment failed. Order cancelled."
}

Error Responses:
400 Bad Request – Insufficient stock or invalid data
401 Unauthorized – Token missing or invalid

## 2. Get Order by Order ID

Endpoint:
GET /orders/:orderId

Description:
Retrieves order details using the order ID.

Headers:
Authorization: Bearer <jwt_token>

Success Response:

200 OK
json
{
  "id": 12,
  "user_id": 5,
  "status": "CONFIRMED",
  "items": [
    {
      "inventory_id": 1,
      "quantity": 2
    }
  ]
}

Error Responses:
404 Not Found – Order not found
401 Unauthorized – Token missing or invalid

## 3. List Orders for Customer (Pagination)

Endpoint:
GET /orders?page=1&limit=10
Description:
Returns paginated orders for the logged-in customer.

Headers:
Authorization: Bearer <jwt_token>

Success Response:
200 OK
[
  {
    "id": 12,
    "status": "CONFIRMED",
    "created_at": "2025-01-10T12:30:00.000Z"
  },
  {
    "id": 11,
    "status": "CANCELLED",ś
    "created_at": "2025-01-10T12:10:00.000Z"
  }
]


## 4. Filter Orders by Status

Endpoint:
GET /orders?status="CREATED"

Description:
Filters customer orders by order status.

Allowed Status Values
 CREATED
 CONFIRMED
 CANCELLED

Success Response

Same as List Orders API, filtered by status.

## 5. Cancel Order

Endpoint:
PATCH /orders/:orderId/cancel

Description:
Cancels an order and restores inventory stock.
* Only cancellable if not already cancelled

Headers:
Authorization: Bearer <jwt_token>

Success Response:
200 OK
{
  "message": "Order cancelled"
}

Error Responses

400 Bad Request – Order already cancelled or invalid
404 Not Found – Order not found

## Notes

* Inventory stock is updated automatically
* Stock rollback occurs on payment failure or cancellation
* Order filtering uses query parameters
* No direct inventory update API exists
