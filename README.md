# Servicios Don Mateo

Agenda comunitaria para encontrar, recomendar y publicar prestadores de confianza en el barrio Don Mateo.

**Contactos recomendados por vecinos.**

## Stack

Next.js · Tailwind · Prisma · Neon (Postgres) · Auth.js · Vercel

## Desarrollo local

Local y producción usan **la misma base en Neon**. No hace falta Docker ni Postgres en la máquina.

1. Copiá el entorno:

```bash
cp .env.example .env
```

Completá `DATABASE_URL` y `DIRECT_URL` con las URLs de Neon, y `AUTH_SECRET` (`openssl rand -base64 32`).

2. Si las tablas todavía no existen:

```bash
npx prisma db push
npx prisma db seed
```

3. Arrancá la app:

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

Registro cerrado: hace falta el código `DONMATEO2026` o el link del grupo, `/unirse/DONMATEO2026`.

El seed solo carga categorías. No hay usuarios ni prestadores de prueba.

## Producción (Neon + Vercel)

Si el deploy abre y ves **404 NOT_FOUND** de Vercel (fondo negro, no la app), casi siempre es una de estas:

1. **Framework Preset no es Next.js.** En Vercel → Project → Settings → General → Build & Development Settings → Framework Preset = **Next.js**. Después Redeploy.
2. **Faltan variables de entorno** y el build falló (no hay deployment de producción). Agregá las de abajo en Settings → Environment Variables, para Production, y volvé a desplegar.
3. **AUTH_URL apunta a localhost.** Tiene que ser la URL de Vercel, por ejemplo `https://servicios-don-mateo.vercel.app`.

Variables a cargar en Vercel (las mismas de `.env`, no subas el archivo):

- `DATABASE_URL` — connection string **pooled** de Neon (`...-pooler...`)
- `DIRECT_URL` — connection string **directa** de Neon (sin `-pooler`)
- `AUTH_SECRET` — un secreto random (`openssl rand -base64 32`)
- `AUTH_URL` — `https://TU-PROYECTO.vercel.app`
- `COMMUNITY_ACCESS_CODE` — `DONMATEO2026`
- `ADMIN_PHONE` — `5491100000001`
- `BLOB_READ_WRITE_TOKEN` — opcional, para fotos

Después de guardar las variables: **Deployments → ⋮ → Redeploy** (sin cache).

El schema de Neon ya está creado en local con `prisma db push`. No hace falta volver a seedear datos de demo.

## Recorrido principal

1. Busco lo que necesito
2. Veo prestadores recomendados
3. Reviso comentarios
4. Toco WhatsApp
5. Contacto
