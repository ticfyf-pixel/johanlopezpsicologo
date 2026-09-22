# Johan López — Sitio web profesional

Página de psicología clínica, salud mental y drogodependencias. Lista para subir a [Render](https://render.com).

## Cómo está organizado

```
public/                 Sitio visible (HTML, CSS, JS, logo)
server.js               Servidor Node para Render
package.json            Dependencias y comando de arranque
render.yaml             Configuración del servicio en Render
.env.example            Variables opcionales del formulario
PROMTS/                 Prompt de diseño original
```

El logo de Gemini (triqueta Cuerpo · Mente · Alma) quedó en `public/assets/logo.jpg`.

## Probar en el computador

1. Instala [Node.js 18 o superior](https://nodejs.org/).
2. En esta carpeta, abre una terminal y ejecuta:

```bash
npm install
npm start
```

3. Abre `http://localhost:4173`.

## Subirlo a Render

Render necesita el proyecto en GitHub o GitLab.

1. Crea un repositorio e sube esta carpeta completa (incluido `package.json` y `server.js`).
2. Entra a [https://dashboard.render.com](https://dashboard.render.com) e inicia sesión.
3. **New +** → **Web Service** → conecta el repositorio.
4. Usa estos valores:

| Campo | Valor |
|---|---|
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance | Free |

5. Crea el servicio. En unos minutos tendrás una URL `https://algo.onrender.com`.
6. (Opcional) En **Settings → Custom Domain** agrega tu dominio.

El archivo `render.yaml` deja el servicio preconfigurado si usas Blueprint: **New +** → **Blueprint**.

### Formulario de contacto (opcional)

Sin correo SMTP el formulario abre WhatsApp con el mensaje, que es el canal principal (`310 462 3399`).

Si quieres que también llegue un correo a `jltriada8@gmail.com`:

1. En Render, **Environment**.
2. Agrega `SMTP_USER`, `SMTP_PASS`, `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `CONTACT_TO=jltriada8@gmail.com`.
3. Con Gmail usa una [contraseña de aplicación](https://myaccount.google.com/apppasswords), no la clave normal.

### Alternativa: sitio estático

Si no quieres Node, en Render elige **Static Site**, carpeta de publicación `public`, y deja el build vacío. El formulario seguirá funcionando porque, si no hay API, redirige a WhatsApp.

## Después del primer deploy

El dominio canónico es `https://johanlopezpsicologo.com`. `www` redirige a esa dirección.

Para aparecer en Google:

1. Entra a [Google Search Console](https://search.google.com/search-console).
2. Agrega la propiedad **Prefijo de URL**: `https://johanlopezpsicologo.com`.
3. Verifica el dominio (registro TXT en el DNS o archivo HTML).
4. En **Sitemaps**, envía `https://johanlopezpsicologo.com/sitemap.xml`.
5. En **Inspección de URLs**, pide indexación de la página de inicio.
