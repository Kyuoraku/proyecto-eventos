# Proyecto Eventos

API REST para una plataforma de eventos. El proyecto permitirá publicar eventos y, en próximas entregas, registrar usuarios y gestionar sesiones e inscripciones.

## Tecnologías

- Node.js
- Express
- MongoDB y Mongoose
- dotenv
- JavaScript con módulos ESM

## Instalación

```powershell
git clone https://github.com/Kyuoraku/proyecto-eventos.git
cd proyecto-eventos
npm install
```

## Variables de entorno

Crear `.env` a partir del archivo de ejemplo:

```powershell
Copy-Item .env.example .env
```

Variables disponibles:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb://127.0.0.1:27017/proyecto-eventos
JWT_SECRET=reemplazar_por_una_clave_segura
```

## Ejecución

Modo desarrollo:

```powershell
npm run dev
```

Modo normal:

```powershell
npm start
```

## Estructura

```text
src/
├── config/
├── controllers/
├── dao/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
├── app.js
└── server.js
```

- `app.js` configura Express, los middlewares y las rutas.
- `server.js` inicia el servidor HTTP.
- Las demás carpetas separan las responsabilidades de la aplicación por capas.

## Rutas disponibles

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Informa si el servidor está activo. |
| GET | `/api/events` | Devuelve la lista inicial de eventos. |
| GET | `/api/sessions` | Confirma que el recurso de sesiones está disponible. |
