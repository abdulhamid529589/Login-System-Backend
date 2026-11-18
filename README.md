# Login System Backend

Express.js API for user registration, login, and protected routes. Users are stored in MongoDB. Passwords are hashed with bcrypt. Auth uses JWT.

## Setup

```bash
npm install
cp .env.example .env
```

Set `MONGO_URI`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` in `.env`, then start MongoDB and run:

```bash
npm run dev
```

Server: `http://localhost:5001`

## Endpoints

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | No |
| POST | `/api/v1/auth/login` | No |
| GET | `/api/v1/auth/me` | Yes |
| GET | `/api/v1/auth/logout` | Yes |
| POST | `/api/v1/auth/refresh-token` | Refresh token |
| PUT | `/api/v1/auth/password/update` | Yes |
| GET | `/api/v1/protected/profile` | Yes |
| GET | `/api/v1/protected/admin` | Admin |

Register:

```bash
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"secret123"}'
```

Login:

```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}'
```

Protected route:

```bash
curl http://localhost:5001/api/v1/protected/profile \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Notes

- Passwords are hashed before save and are never returned in responses
- Access token expires in 15 minutes; refresh token expires in 7 days
- Login is rate limited
- Send the access token as `Authorization: Bearer <token>` or as an httpOnly cookie
