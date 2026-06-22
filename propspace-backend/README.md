# PropSpace — Backend API

REST + real-time backend for the PropSpace property listing app.
Node.js · Express 5 · MongoDB (Mongoose) · JWT auth · Socket.io.

## Stack
- **Express 5** — async errors auto-forward to the error handler (no wrappers needed)
- **Mongoose** — schemas, validation, text search
- **bcryptjs** — password salting + hashing
- **jsonwebtoken** — stateless auth
- **socket.io** — live listing updates

## Setup

```bash
npm install
cp .env.example .env      # then edit .env with your values
npm run dev               # auto-restarts on file changes
# or: npm start
```

You need a running MongoDB instance (local `mongod` or a MongoDB Atlas URI).

### Environment variables (.env)
| Key | Description |
|-----|-------------|
| `PORT` | API port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random secret for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend origin for CORS (e.g. http://localhost:5173) |
| `NODE_ENV` | `development` or `production` |

## Project structure (layered architecture)
```
server.js                 # entry: DB + HTTP server + socket.io
src/
  app.js                  # express app + route mounting
  config/db.js            # mongoose connection
  routes/                 # Routes layer — parse params, run middleware, delegate
  controllers/            # HTTP adapters — read req, call service, send response
  services/               # Controller/Service layer — business rules & validation
  repositories/           # Data Repository layer — the ONLY layer touching models
  models/                 # User, Property schemas
  middleware/             # protect (JWT), error handlers
  socket/                 # real-time event wiring
  utils/                  # JWT generator, ApiError, user view shaper
```

**Request flow:** `route → controller → service → repository → model`.
Business logic lives only in services; database access lives only in
repositories; controllers are thin HTTP adapters. Services throw `ApiError`,
which the central error handler maps to the right HTTP status.

## API reference

### Auth — `/api/auth`
| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | `/register` | — | `username, email, password, name?, phone?` |
| POST | `/login` | — | `identifier` (email or username), `password` |
| GET  | `/me` | Bearer | — |

### Users — `/api/users`
| Method | Path | Auth | Body |
|--------|------|------|------|
| PUT | `/profile` | Bearer | `name?, phone?, avatar?` |
| PUT | `/password` | Bearer | `currentPassword, newPassword` |

### Properties — `/api/properties`
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/` | — | Filters: `keyword, city, listingType, propertyType, minPrice, maxPrice, bedrooms, status, page, limit, sort` |
| GET | `/:id` | — | Single property |
| GET | `/mine/list` | Bearer | Dashboard — your listings |
| POST | `/` | Bearer | Create |
| PUT | `/:id` | Bearer (owner) | Update |
| DELETE | `/:id` | Bearer (owner) | Delete |

### Auth header
```
Authorization: Bearer <token>
```

## Real-time events (Socket.io)
The server emits to all connected clients:
- `property:new` — a listing was created
- `property:updated` — a listing was edited
- `property:deleted` — `{ id }` of a removed listing

Optional rooms: clients may emit `join:city` / `leave:city` with a city name.

## Example requests
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"jdoe","email":"jdoe@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"jdoe","password":"secret123"}'

# Create a property (use the token from login)
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Sunny 2BR","description":"Great light","price":1200,"listingType":"rent","propertyType":"apartment","bedrooms":2}'
```
