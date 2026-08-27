# Servicios Don Mateo

Agenda comunitaria para encontrar, recomendar y publicar prestadores de confianza en el barrio Don Mateo.

**Contactos recomendados por vecinos.**

## Stack

Next.js · Tailwind · Prisma · Postgres (Neon en producción) · Auth.js · Vercel

## Desarrollo local

1. Copiá el entorno:

```bash
cp .env.example .env
openssl rand -base64 32   # pegalo en AUTH_SECRET
```

2. Levantá Postgres. Con Docker:

```bash
docker compose up -d
```

Sin Docker, con Homebrew:

```bash
brew install postgresql@16
brew services start postgresql@16
createuser -s donmateo
createdb -O donmateo donmateo
psql -d donmateo -c "ALTER USER donmateo WITH PASSWORD 'donmateo';"
```

En producción usá [Neon](https://neon.tech): copiá el connection string pooled a `DATABASE_URL` y el directo a `DIRECT_URL`.

3. Migrá y cargá datos de ejemplo:

```bash
npx prisma db push
npx prisma db seed
```

4. Arrancá la app:

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

### Cuentas de demo (contraseña `donmateo`)

| Rol | Email |
| --- | --- |
| Vecina | `mariana@donmateo.ar` |
| Moderador | `moderacion@donmateo.ar` |
| Prestador | `daniel@donmateo.ar` |

Código de comunidad para registrarse: `DONMATEO`

## Producción (Neon + Vercel)

1. Creá una base en [Neon](https://neon.tech) y copiá el connection string pooled a `DATABASE_URL` y el directo a `DIRECT_URL`.
2. En Vercel, configurá:

- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `AUTH_URL` (URL pública)
- `COMMUNITY_ACCESS_CODE`
- `ADMIN_EMAIL`
- `BLOB_READ_WRITE_TOKEN` (opcional, para fotos)

3. Deploy. En el primer deploy corré `npx prisma db push` y `npx prisma db seed` contra Neon, o usá `prisma migrate deploy` cuando agregues migraciones.

## Recorrido principal

1. Busco lo que necesito
2. Veo prestadores recomendados
3. Reviso comentarios
4. Toco WhatsApp
5. Contacto
