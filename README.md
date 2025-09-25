# Notes SaaS (Multi-tenant)

**Enfoque multiinquilino:** esquema compartido con columna `tenant` (ObjectId a `Tenant`) en `User` y `Note`.
El aislamiento se aplica filtrando por `tenant` del usuario autenticado en **todas** las consultas.

## Cuentas de prueba (pass: `pass1234`)
- admin@acme.test (admin)
- user@acme.test (member)
- admin@globex.test (admin)
- user@globex.test (member)

## Auth y roles
- JWT (`POST /auth/login`)
- **admin:** invitar usuarios (`POST /users/invite`) y actualizar plan (`POST /tenants/:slug/upgrade`)
- **member:** CRUD de notas

## Suscripción
- `free`: máx. 3 notas por tenant (`free_limit_reached`)
- `pro`: sin límite (upgrade inmediato)

## API Notas
- POST /notes
- GET /notes
- GET /notes/:id
- PUT /notes/:id
- DELETE /notes/:id

## Health
`GET /health` → `{ "status":"ok" }`

## Deploy
- Backend/Frontend en Vercel
- Backend env: `MONGODB_URI`, `JWT_SECRET`, `SEED_PASSWORD`, `CORS_ORIGIN`
- Frontend env: `VITE_API_URL`
