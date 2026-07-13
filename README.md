# FerreExamen

Proyecto full-stack orientado a la gestión de catálogo e inventario de una ferretería, estructurado en dos módulos principales: `ferremas-api` para la lógica de backend y `ferremas-web` para la interfaz de usuario. El repositorio es público en GitHub, usa principalmente JavaScript y actualmente contiene esos dos directorios como base del proyecto.

## Estructura del proyecto

El repositorio está organizado en dos carpetas principales: `ferremas-api` y `ferremas-web`, lo que sugiere una separación entre servicios de backend y aplicación cliente. GitHub identifica a JavaScript como el lenguaje predominante del proyecto, acompañado por CSS y HTML en menor proporción.

```text
FerreExamen/
├── ferremas-api/
└── ferremas-web/
```

## Propósito

El objetivo del proyecto es centralizar la administración de productos, categorías, stock y precios dentro de un contexto de ferretería, permitiendo consumir datos desde una API y mostrarlos en una interfaz web. La estructura de datos trabajada durante el desarrollo contempla entidades como productos, categorías e historial de precios, lo que permite representar precios vigentes y evolución de valores por producto.

## Tecnologías

Según la información pública del repositorio, la base del proyecto está desarrollada principalmente con JavaScript, además de CSS y HTML para la capa visual.[1] Una organización en carpetas separadas para API y frontend es consistente con una arquitectura web desacoplada, adecuada para escalar funcionalidades de catálogo, inventario y visualización.

- JavaScript.
- CSS.
- HTML.
- Estructura separada entre backend (`ferremas-api`) y frontend (`ferremas-web`).

## Modelo de datos

La base de datos del proyecto define tablas para roles, usuarios, categorías, productos e historial de precios. En particular, la tabla `Producto` almacena datos como código interno, marca, código de marca, nombre, categoría y stock, mientras que `Historial_Precio` registra el valor del producto en una fecha determinada.

### Tablas principales

| Tabla | Descripción |
|------|-------------|
| `Rol` | Define los perfiles del sistema, como administrador, vendedor o cliente. |
| `Usuario` | Almacena usuarios del sistema con correo, contraseña hash y rol asociado. |
| `Categoria` | Agrupa los productos del catálogo por tipo. |
| `Producto` | Registra SKU, marca, nombre, categoría y stock de cada producto. |
| `Historial_Precio` | Guarda precios por producto y fecha, permitiendo consultar el valor vigente. |

## Funcionalidades esperadas

A partir de la estructura del repositorio y de la base de datos disponible, el proyecto puede cubrir escenarios como gestión de productos, visualización del catálogo, consulta de stock y obtención del precio actual desde el historial de precios. Para mostrar correctamente los precios en la web, el backend debe unir `Producto` con `Historial_Precio` y entregar el valor más reciente por cada producto.

## Instalación

Como el repositorio expone un módulo web y uno API, la instalación debería realizarse por separado dentro de cada carpeta del proyecto. El detalle exacto de dependencias y scripts no aparece en la vista pública revisada, por lo que estos pasos deben ajustarse según los archivos `package.json` existentes en cada módulo.

```bash
git clone https://github.com/BtaGames022/FerreExamen.git
cd FerreExamen

cd ferremas-api
npm install

cd ../ferremas-web
npm install
```

## Ejecución

La forma de ejecución dependerá de los scripts definidos en cada módulo, pero en proyectos JavaScript de este tipo normalmente se inicia primero la API y luego el cliente web. Conviene revisar los scripts disponibles en los `package.json` de `ferremas-api` y `ferremas-web` antes de documentar comandos definitivos en GitHub.

```bash
# Backend
cd ferremas-api
npm run dev

# Frontend
cd ../ferremas-web
npm run dev
```

## Base de datos

El script de base de datos disponible crea una base llamada `ferremas_db`, define las tablas principales del sistema y agrega datos iniciales para roles, usuarios, categorías, productos e historial de precios. Ese diseño permite trabajar con catálogo, inventario y precios versionados, en lugar de guardar un único precio fijo dentro de la tabla de productos.
