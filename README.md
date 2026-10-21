# Proyecto Eventos

API REST para una plataforma de eventos, desarrollada con Node.js, Express y MongoDB. La Pre-entrega 2 incorpora el registro de usuarios con validaciones, normalización de email y almacenamiento seguro de contraseñas.

## Tecnologías

- Node.js y JavaScript con módulos ESM
- Express
- MongoDB y Mongoose
- bcryptjs para el hash de contraseñas
- dotenv para las variables de entorno

## Requisitos

- Node.js y npm instalados.
- Una instancia de MongoDB local o un clúster de MongoDB Atlas accesible.

## Instalación y configuración

```powershell
git clone https://github.com/Kyuoraku/proyecto-eventos.git
cd proyecto-eventos
npm install
Copy-Item .env.example .env
```

Configurar `.env` con los valores del entorno:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb://127.0.0.1:27017/proyecto-eventos
JWT_SECRET=reemplazar_por_una_clave_segura
```

`MONGO_URL` debe contener la URI de la base de datos que se utilizará. Para una instalación local, MongoDB debe estar iniciado. Para Atlas, configurar la URI con el usuario, la contraseña y la base correspondientes, y habilitar el acceso desde la IP utilizada.

`JWT_SECRET` forma parte de la configuración de ejemplo y no interviene en el registro de esta entrega. Los archivos `.env` y `node_modules` están excluidos mediante `.gitignore`.

## Ejecución

Modo desarrollo, con recarga automática:

```powershell
npm run dev
```

Modo normal:

```powershell
npm start
```

Con la configuración de ejemplo, la API utiliza `http://localhost:8080`. Antes de probar el registro, comprobar que la consola muestre `conectado a DB`.

## Organización del proyecto

```text
src/
├── config/
│   ├── db.js
│   └── env.js
├── controllers/
│   └── sessions.controller.js
├── models/
│   └── userModel.js
├── routes/
│   └── sessions.router.js
├── services/
│   └── sessions.service.js
├── utils/
│   └── hash.js
├── app.js
└── server.js
```

Archivos principales del registro:

- La ruta deriva la solicitud al controller.
- El controller devuelve la respuesta HTTP y maneja los códigos de error.
- El service valida los datos, normaliza el email, verifica duplicados y registra al usuario mediante el modelo de Mongoose.
- El modelo define los campos y las restricciones del usuario.
- El helper de `utils/hash.js` genera el hash de la contraseña y puede reutilizarse.
- `config/db.js` establece la conexión a MongoDB.

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Estado del servidor. |
| GET | `/api/events` | Lista inicial de eventos. |
| GET | `/api/sessions` | Estado del recurso de sesiones. |
| POST | `/api/sessions/register` | Registro de usuarios. |

## Registro de usuarios

### Solicitud

Enviar `POST /api/sessions/register` con el encabezado `Content-Type: application/json`.

| Campo | Tipo | Requerido | Validación |
| --- | --- | --- | --- |
| `first_name` | string | Sí | Nombre del usuario. |
| `last_name` | string | Sí | Apellido del usuario. |
| `email` | string | Sí | Formato válido y sin registros previos con el mismo email normalizado. |
| `password` | string | Sí | Mínimo 6 caracteres. |

El email se normaliza con `trim()` y `toLowerCase()` antes de validar su formato, buscar duplicados y guardar. El registro público asigna siempre `role: "user"`, aunque se envíe otro rol en el body. El modelo admite los roles `user`, `organizer` y `admin`.

En Postman, seleccionar el método **POST**, ingresar `http://localhost:8080/api/sessions/register` y configurar **Body > raw > JSON** con este contenido:

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

También se puede probar desde PowerShell:

```powershell
$body = @{
  first_name = "Ana"
  last_name = "Pérez"
  email = "Ana@Mail.com "
  password = "Secreta123"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8080/api/sessions/register" `
  -ContentType "application/json; charset=utf-8" `
  -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
```

### Respuestas

**201 Created:** usuario registrado. Ejemplo de respuesta; el identificador y las fechas son ilustrativos.

```json
{
  "status": "success",
  "payload": {
    "_id": "665f2a123456789012345678",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user",
    "createdAt": "2026-10-20T20:00:00.000Z",
    "updatedAt": "2026-10-20T20:00:00.000Z",
    "__v": 0
  }
}
```

La contraseña se guarda como hash en MongoDB y se elimina del objeto de respuesta. No se devuelve en texto plano ni hasheada.

**400 Bad Request:** campos obligatorios faltantes, email inválido o contraseña inválida. Ejemplo:

```json
{
  "status": "error",
  "message": "El formato del mail es incorrecto"
}
```

**409 Conflict:** email ya registrado.

```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

**500 Internal Server Error:** error inesperado.

```json
{
  "status": "error",
  "message": "Error interno del servidor"
}
```

## Verificación

Se probaron las siguientes condiciones mediante solicitudes HTTP y una conexión real a MongoDB:

| Caso | Resultado verificado |
| --- | --- |
| Registro válido | Respuesta `201` y usuario persistido. |
| Email con espacios y mayúsculas | Almacenamiento del email sin espacios externos y en minúsculas. |
| Falta de cada campo obligatorio | Respuesta `400`. |
| Email con formato inválido | Respuesta `400`. |
| Contraseña corta o numérica | Respuesta `400`. |
| Email duplicado con diferencias de mayúsculas o espacios | Respuesta `409`. |
| Envío de `role: "admin"` | Usuario almacenado con rol `user`. |
| Contraseña en la base de datos | Hash diferente del texto original, verificado con `bcrypt.compare()`. |
| Respuesta del registro | Sin el campo `password`. |

Para reproducir las pruebas, utilizar datos de prueba y repetir la solicitud con el mismo email para comprobar el rechazo de duplicados. El usuario almacenado puede inspeccionarse con MongoDB Compass o desde Atlas.
