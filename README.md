# Backend-Dev-10xers-Labs

## Endpoints

List of available endpoints:

- `POST /users/login`
- `GET /phones`
- `POST /phones`
- `PUT /phones/:id`
- `DELETE /phones/:id`

&nbsp;

## 1. POST /users/login

Request :

- body :

```json
{
  "name": "string",
  "password": "string"
}
```

_Response (200 - Ok)_

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InVzZXIxIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE0MzA3MjQzfQ.IuWPYJd4D7RicWoBI9dsCvSXz6JRk8hfmFyMnSKxSsA"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Please login first"
}
```

_Response (404 = Not Found)_

```json
{
  "message": "Data Not Found"
}
```

&nbsp;

## 2. GET /phones

Description :

- Get all data phone from database

Request :

- headers :

```json
{
  "access_token": "string"
}
```

_Response (200 - Ok)_

```json
[
  {
    "id": 1,
    "brand": "Samsung",
    "model": "Galaxy S21",
    "colors": "Black",
    "price": 12000000,
    "stock": 50,
    "userId": 1,
    "createdAt": "2024-04-28T12:06:11.137Z",
    "updatedAt": "2024-04-28T12:06:11.137Z"
  },
  ...
]
```

&nbsp;

## 3. POST /phones

Description :

- Add data phone to database

Request :

- headers :

```json
{
  "access_token": "string"
}
```

- body :

```json
{
  "brand": "string",
  "model": "string",
  "colors": "string",
  "price": "integer",
  "stock": "integer"
}
```

_Response (201 - Created)_

```json
{
  "id": 6,
  "brand": "Poco",
  "model": "Poco F1",
  "colors": "Red",
  "price": 12000000,
  "stock": 10,
  "userId": 1,
  "updatedAt": "2024-04-28T13:14:22.810Z",
  "createdAt": "2024-04-28T13:14:22.810Z"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": ["Brand is required", "Model is required", "Colors is required", "Price is required", "Stock is required"]
}
```

&nbsp;

## 4. PUT /phones/:id

Description :

- Update data phone by id

Request :

- headers :

```json
{
  "access_token": "string"
}
```

- params :

```json
{
  "id": "integer"
}
```

- body :

```json
{
  "brand": "string",
  "model": "string",
  "colors": "string",
  "price": "integer",
  "stock": "integer"
}
```

_Response (200 - Ok)_

```json
[
  {
    "id": 6,
    "brand": "Poco",
    "model": "Poco F3",
    "colors": "Red",
    "price": 7000000,
    "stock": 15,
    "userId": 1,
    "createdAt": "2024-04-28T13:14:22.810Z",
    "updatedAt": "2024-04-28T13:20:39.719Z"
  }
]
```

_Response (400 - Bad Request)_

```json
{
  "message": ["Brand is required", "Model is required", "Colors is required", "Price is required", "Stock is required"]
}
```

&nbsp;

## 5. DELETE /phones/:id

Description :

- Delete data phone by id from database

Request :

- headers :

```json
{
  "access_token": "string"
}
```

- params :

```json
{
  "id": "integer"
}
```

_Response (200 - Ok)_

```json
{
  "message": "Phone has been deleted"
}
```

&nbsp;

## 6. Global Error

_Response (500 - Internal server error)_

```json
{
  "messages": "Internal server error"
}
```
