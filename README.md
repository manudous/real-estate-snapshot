# Real Estate — Content Island + Snapshot Mode

Sitio inmobiliario hecho con **Astro (SSG)** que consume contenido de **Content Island**.
Sirve de ejemplo del **snapshot mode**: en producción el contenido se exporta una vez a un
fichero (`content-island-snapshot.json`) y el build lee de ahí, sin llamar a la API.

## Cómo funciona el modo

El cliente (`src/lib/client.ts`) elige el modo según el entorno:

```ts
mode: import.meta.env.PROD ? "snapshot" : "api"
```

- **`astro dev`** → modo `api`: contenido en vivo desde Content Island.
- **`astro build`** → modo `snapshot`: lee de `content-island-snapshot.json` (0 llamadas a la API).

> Requiere `@content-island/api-client` **>= 0.23.0** (primera versión con snapshot mode y el CLI `content-island export`).

## Requisitos

- Node 24
- Un **access token de lectura** de Content Island.

## Desarrollo local

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un `.env` (a partir de `.env-sample`) con tu token:
   ```
   CONTENT_ISLAND_ACCESS_TOKEN=tu-token-de-lectura
   ```
3. Arranca el dev server (modo `api`, contenido en vivo):
   ```bash
   npm run dev
   ```

## Probar el snapshot en local

El CLI **no lee el `.env`**, así que pásale el token por variable de entorno:

```bash
# 1. Exporta el snapshot a content-island-snapshot.json
CONTENT_ISLAND_ACCESS_TOKEN=tu-token npm run export-snapshot

# 2. Build en modo snapshot (lee del fichero)
npm run build

# 3. Previsualiza el resultado
npm run preview
```

> El snapshot (`content-island-snapshot.json`) está en `.gitignore`: se regenera en cada build.

## Despliegue en GitHub Pages (automático)

El deploy es automático vía GitHub Actions (`.github/workflows/deploy.yml`). En cada push a `main`:

1. **Export** (con el token secreto) → genera `content-island-snapshot.json` en el runner. **Fichero efímero: no se sube al repo** (está en `.gitignore`).
2. **Build sin token** → `npm run build` en modo snapshot. Como el build no tiene credenciales, no puede llamar a la API: lee del snapshot del paso anterior. Es la prueba de que el contenido sale del fichero.
3. Publica `dist/` en GitHub Pages.

URL publicada: **https://manudous.github.io/real-estate-snapshot/**

Configuración (solo una vez):

1. **Repo público** (Pages gratis necesita repo público).
2. **Settings → Secrets and variables → Actions → New repository secret**:
   - **Name:** `CONTENT_ISLAND_ACCESS_TOKEN`
   - **Value:** tu token de lectura
   Solo lo usa el paso de **export**; el build corre sin él.
3. **Settings → Pages → Source: GitHub Actions**.
4. La ruta base está fijada en `astro.config.mjs` (`base: "/real-estate-snapshot/"`) porque es una
   *project page* servida en subcarpeta. Los enlaces internos usan `import.meta.env.BASE_URL`.

> El token debe ser de **lectura**. Un token con prefijo `PREVIEW_` exporta la vista *preview*; cualquier otro, la *published*.
