# 🇩🇴 Dominicana API + Frontend

Este proyecto contiene una API desplegada en Cloudflare Workers y una página estática desplegada en Vercel que consume esa API.

---

## 🛠️ Tecnologías utilizadas

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Vercel](https://vercel.com/)
- JavaScript/TypeScript (según el caso)

---

## 📦 Instalación

Cloná el repositorio:

```bash
git clone https://github.com/tu-usuario/dominicana.git
cd dominicana
```

Instalá las dependencias (si aplica):

```bash
npm install
```

---

## 🔐 Configuración de Secrets (Cloudflare Workers)

Este proyecto requiere dos variables secretas para funcionar correctamente:

- `USERNAME`
- `PASSWORD`

### Cómo configurarlos:

Desde tu terminal:

```bash
wrangler secret put USERNAME
wrangler secret put PASSWORD
```

> ⚠️ Estos secrets se almacenan en tu entorno remoto de Cloudflare (no en tu código). Si clonás este proyecto o cambiás de máquina, debés volver a definirlos.

---

## ▶️ Levantar entorno local

Podés ejecutar el Worker en modo desarrollo con:

```bash
wrangler dev
```

Esto iniciará un servidor local en `http://localhost:8787`.

---

## 🚀 Deploy

Para desplegar tu Worker en Cloudflare:

```bash
wrangler deploy
```

El comando usará la configuración definida en `wrangler.toml`.

---

## 🌐 Frontend en Vercel

El frontend estático (`index.html`) se encuentra en la carpeta `public/`. Esta carpeta se configura como **Root Directory** en Vercel.

### Configuración sugerida en Vercel:

- **Framework Preset**: `Other`
- **Root Directory**: `public`
- **Build Command**: *(vacío)* o `echo OK`
- **Output Directory**: `public`

La página desplegada en Vercel puede consumir tu API desplegada en Cloudflare.

---

## 📁 Estructura recomendada

```
dominicana/
├── public/          ← Página estática (index.html)
├── src/             ← Código del Worker (Cloudflare)
├── wrangler.toml    ← Configuración del Worker
├── package.json
└── README.md
```

---

## 📬 Contacto

Este proyecto fue desarrollado por Matias Alpuin. Para dudas o mejoras, ¡sentite libre de abrir un issue o un pull request!
