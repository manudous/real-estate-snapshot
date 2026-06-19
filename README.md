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

## Despliegue en Render

El repo incluye un `render.yaml` (Blueprint) con un **Static Site** que ejecuta export + build:

```yaml
buildCommand: npm ci && npx content-island export && npm run build
staticPublishPath: ./dist
```

Pasos:

1. En Render: **New → Blueprint** y selecciona este repositorio (detecta `render.yaml`).
   *(Alternativa: **New → Static Site**, con Build Command `npm ci && npx content-island export && npm run build` y Publish Directory `dist`.)*
2. **Añade el token de Content Island como variable de entorno** (este es el sitio donde va el token):
   **Dashboard del servicio → Environment → Add Environment Variable**
   - **Key:** `CONTENT_ISLAND_ACCESS_TOKEN`
   - **Value:** tu token de lectura

   El `buildCommand` lo usa en el paso `content-island export`.
3. **Create**. Render hará el primer deploy (export + build en modo snapshot) y publicará `dist/`.
4. Cada push a `main` dispara un nuevo deploy automáticamente (auto-deploy de Render).

> El token debe ser de **lectura**. Un token con prefijo `PREVIEW_` exporta la vista *preview*; cualquier otro, la *published*.
