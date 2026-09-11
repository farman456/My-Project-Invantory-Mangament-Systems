# Generate adonis key

`node ace generate:key`

# Requirements

- nodejs 20
- mysql 8
- redis 7
- smtp

# where to define config

- services.ts

# where to define env so they should be cast

- env.ts
- define all evn there so they should be automatically cast to specific type like string, boolean or number

# rules

## variables

- variables names should be camel case in controller, services and validator
- example

```
userType

userId

companyUserRoles
```

- routes name should be snake case
- example

```
api/users/generate-report

api/users/:userId/logs
```

# email sending

- first create email class
- `node ace make:mail WelcomeEmail`
- create email send event so we can dispatch the email
- check the events.ts file for email sending

# Commands for day to day development

npm run format
npm run lint
npm run typecheck
npm run spellcheck

## Product API

All Product API endpoints require an authenticated user and authorization middleware.
Send `Accept: application/json` and, for requests with a body, `Content-Type: application/json`.
Send the authentication credentials expected by the configured AdonisJS auth guard.

### Get Products

`GET /api/products`

Optional query parameters:

- `page`, `perPage` for pagination
- `search` to search product names
- `type`, `supplier`, `status` for filtering
- `minPrice`, `maxPrice` for price filtering
- `sort` with `id`, `name`, `price`, or `status`
- `order` with `asc` or `desc`

Successful responses contain `items` and `pagination` metadata with `total`, `perPage`,
`currentPage`, and `lastPage`.

### Get Single Product

`GET /api/products/:productId`

### Create Product

`POST /api/products`

```json
{
	"name": "Paracetamol",
	"type": 1,
	"supplier": 1,
	"price": 12.5,
	"status": "active",
	"actions": ""
}
```

`name`, `type`, `supplier`, and `price` are required. `status` and `actions` are optional.

### Update Product

`PUT /api/products/:productId`

PUT requires `name`, `type`, `supplier`, and `price`; `status` and `actions` are optional.
The request body uses the same fields as the create request.

### Partial Update Product

`PATCH /api/products/:productId`

Any of `name`, `type`, `supplier`, `price`, `status`, or `actions` may be supplied.

```json
{
	"price": 15.25,
	"status": "active"
}
```

### Delete Product

`DELETE /api/products/:productId`

Successful create, read, update, and delete responses use the API success response format.
Common errors are `400` for validation or malformed input, `401` for unauthenticated
requests, `403` for unauthorized users, `404` for a missing product, and `500` for
server or database failures.

### Thunder Client Tests

Use the configured base URL and authentication credentials for each request.

| Method | URL | Body | Expected status |
|---|---|---|---|
| GET | `/api/products?page=1&perPage=20&search=para&status=active&sort=name&order=asc` | None | `200`, paginated products |
| GET | `/api/products/1` | None | `200`, one product; `404` if missing |
| POST | `/api/products` | Create JSON above | `200`, created product; `400` for invalid input |
| PUT | `/api/products/1` | Complete update JSON | `200`, updated product; `400` for incomplete input |
| PATCH | `/api/products/1` | `{ "price": 15.25 }` | `200`, partially updated product |
| DELETE | `/api/products/1` | None | `200`, deletion confirmation |

Runtime/API testing: Not yet verified - Thunder Client testing required.
