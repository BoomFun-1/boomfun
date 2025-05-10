# BOOM.FUN API Documentation

## API Overview

### Basic Information
- Base URL: `https://api.boom.fun/v1`
- Authentication: Bearer Token
- Response Format: JSON

## Authentication API

### User Registration
```http
POST /auth/register
```

**Request Parameters**
```json
{
  "email": "string",
  "password": "string",
  "username": "string"
}
```

**Response Example**
```json
{
  "status": "success",
  "data": {
    "userId": "string",
    "token": "string"
  }
}
```

### User Login
```http
POST /auth/login
```

**Request Parameters**
```json
{
  "email": "string",
  "password": "string"
}
```

## Token API

### Create Token
```http
POST /tokens/create
```

**Request Parameters**
```json
{
  "name": "string",
  "symbol": "string",
  "totalSupply": "number",
  "decimals": "number"
}
```

### Get Token List
```http
GET /tokens/list
```

**Query Parameters**
- page: Page number
- limit: Items per page
- sort: Sort method

## Transaction API

### Create Transaction
```http
POST /transactions/create
```

**Request Parameters**
```json
{
  "tokenId": "string",
  "amount": "number",
  "toAddress": "string"
}
```

### Get Transaction History
```http
GET /transactions/history
```

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 500  | Internal Server Error |
| 503  | Service Unavailable |