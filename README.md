# Loc8r - Aplicación de Restaurantes

Aplicación web desarrollada con **Node.js, Express y Pug** para la gestión y visualización de restaurantes y sus reseñas.

## Descripción

Este proyecto forma parte de la asignatura de Tecnologías Web/Móvil.
La aplicación permite:

* Visualizar una lista de restaurantes
* Consultar la información de cada restaurante
* Añadir reseñas (interfaz preparada)
* Navegar entre distintas páginas mediante una barra de navegación

Actualmente, las reseñas aún no se almacenan en base de datos (pendiente de integración con MongoDB).

---

## Tecnologías utilizadas

* Node.js
* Express
* Pug (motor de plantillas)
* Bootstrap
* CSS personalizado
* Git & GitHub

---

## Estructura del proyecto

```
actividad1
├── app.js
├── bin
│   └── www
├── app_server
│   ├── controllers
│   │   └── locations.js
│   ├── routes
│   │   └── index.js
│   └── views
│       ├── layout.pug
│       ├── locations-list.pug
│       ├── location-info.pug
│       ├── location-review-form.pug
│       └── generic-text.pug
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       ├── bootstrap.min.css
│       └── style.css
└── package.json
```

---

## Instalación y ejecución

1. Clonar el repositorio:

```bash
git clone git@github.com:martabp/TWM.git
```

2. Acceder a la carpeta del proyecto:

```bash
cd actividad1
```

3. Instalar dependencias:

```bash
npm install
```

4. Ejecutar la aplicación:

```bash
npm start
```

5. Abrir en el navegador:

```
http://localhost:3000
```

---

## Rutas principales

| Ruta                   | Descripción                   |
| ---------------------- | ----------------------------- |
| `/`                    | Lista de restaurantes         |
| `/location`            | Detalle del restaurante       |
| `/location/review/new` | Formulario para añadir reseña |
| `/about`               | Información de la aplicación  |

---

## Arquitectura

La aplicación sigue el patrón **MVC (Modelo-Vista-Controlador)**:

* **Modelos** → (Pendiente - MongoDB)
* **Vistas** → Pug (`views`)
* **Controladores** → lógica en `controllers`
* **Rutas** → conexión entre URL y controladores

---

## Próximos pasos

* Integración con MongoDB
* Uso de Mongoose para modelado de datos
* Guardado real de reseñas
* Mejoras en la interfaz

---

## Autor

Proyecto desarrollado por ** Marta Borrego Padilla**
Asignatura: Tecnologías y recursos Web/Móvil

---

## 📄 Licencia

Uso académico
