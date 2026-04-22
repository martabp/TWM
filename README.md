# Loc8r - Tecnologías Web

Aplicación web desarrollada con Node.js, Express, MongoDB y Pug para localizar lugares cercanos con conexión wifi, consultar su información y añadir reseñas.

---

## 📌 Descripción

Loc8r es una aplicación web que permite a los usuarios encontrar lugares cercanos donde trabajar, estudiar o relajarse con acceso a internet.

La aplicación integra un backend REST con MongoDB y un frontend renderizado con Pug, además de utilizar geolocalización del navegador para ofrecer resultados cercanos en tiempo real.

---

## 🚀 Funcionalidades

- 📍 Listado de lugares con wifi
- 🌍 Geolocalización del usuario
- 📏 Cálculo de distancia (metros / kilómetros)
- ⭐ Visualización de puntuaciones
- 🏠 Página de detalle de cada local
- 🕒 Horarios de apertura
- 🧩 Servicios disponibles (wifi, café, snacks…)
- ✍️ Añadir reseñas
- 🔗 API REST completa
- 📄 Página About

---

## 🛠️ Tecnologías utilizadas

- Node.js
- Express
- MongoDB / MongoDB Atlas
- Mongoose
- Pug (motor de plantillas)
- HTML, CSS, JavaScript
- Geolocalización (navigator.geolocation)
- Consultas geoespaciales ($geoNear, GeoJSON, 2dsphere)

---

## 📁 Estructura del proyecto

```
actividad1/
├── app_api/
│   ├── controllers/
│   ├── models/
│   └── routes/
├── app_server/
│   ├── controllers/
│   ├── routes/
│   └── views/
├── public/
│   ├── javascripts/
│   └── stylesheets/
├── app.js
└── package.json
```

---

## 🧠 Arquitectura

El proyecto está dividido en dos partes principales:

### Backend (app_api)
- API REST
- Controladores de lugares y reseñas
- Conexión con MongoDB
- Consultas geoespaciales

### Frontend (app_server)
- Vistas en Pug
- Renderizado del listado y detalle
- Formularios de reseñas
- Integración con la API

---

## 🌍 Geolocalización

La aplicación utiliza la ubicación del usuario para mostrar lugares cercanos.

### Frontend
```javascript
navigator.geolocation.getCurrentPosition(...)
```

### Backend
```javascript
$geoNear
```


## Base de datos

El proyecto utiliza MongoDB Atlas.

La base de datos está configurada para permitir acceso desde cualquier IP para facilitar la evaluación.

No es necesario instalar MongoDB en local.
```javascript
{
  type: "Point",
  coordinates: [lng, lat]
}
```

Índice utilizado:
```javascript
locationSchema.index({ coords: '2dsphere' });
```

---
## Configuración

Crear un archivo `.env` en la raíz con:

DB_URI=tu_uri_de_mongodb_atlas

## 🔗 Rutas principales

### Web

- `/` → listado de lugares
- `/location/:locationid` → detalle de un lugar
- `/location/:locationid/review/new` → añadir reseña
- `/about` → información sobre la aplicación

### API REST

- `GET /api/locations`
- `POST /api/locations`
- `GET /api/locations/:locationid`
- `PUT /api/locations/:locationid`
- `DELETE /api/locations/:locationid`
- `POST /api/locations/:locationid/reviews`
- `GET /api/locations/:locationid/reviews/:reviewid`
- `DELETE /api/locations/:locationid/reviews/:reviewid`

---

## ⚙️ Instalación

### 1. Clonar repositorio

```bash
git clone <URL-del-repo>
cd actividad1
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos

Editar la conexión en:

```
app_api/models/db.js
```

(usar MongoDB Atlas si es necesario)

### 4. Ejecutar aplicación

```bash
npm start
```

### 5. Acceso

```
http://localhost:3000
```

---

## 🧪 Pruebas realizadas

- Listado de lugares
- Geolocalización funcional
- Consulta de detalle
- Añadir reseñas
- Consumo de API
- Renderizado dinámico con Pug

---

## 🎨 Mejoras visuales

- Diseño moderno con tarjetas (cards)
- Nueva tipografía
- Layout con hero y sidebar
- Estilos coherentes en todas las vistas
- Formularios rediseñados
- Botones y navegación mejorados

---

## 🔐 Buenas prácticas

- Separación backend/frontend
- Uso correcto de rutas REST
- Manejo de ObjectId en MongoDB
- Validación básica de formularios
- Control de errores HTTP
- Organización del código en módulos

---

## 📈 Posibles mejoras

- Integración completa de mapas
- Sistema de estrellas interactivo
- Autenticación con JWT
- Subida de imágenes
- Filtros de búsqueda
- Diseño responsive avanzado

---

## 👨‍💻 Autor

Proyecto realizado para la asignatura Tecnologías Web.
Marta Borrego Padilla. 2026.

---

## 📊 Estado del proyecto

- Funcional
- Geolocalización operativa
- API REST completa
- Interfaz moderna
- Listo para entrega
