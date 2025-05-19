# Gestor App

Aplicación de gestión desarrollada con TypeScript. Este proyecto busca proporcionar una plataforma intuitiva y modular para manejar distintos tipos de datos o tareas de forma eficiente.

## 🚀 Tecnologías utilizadas

- **TypeScript**
- **React Native / Expo** (según estructura del proyecto)
- **React Context API** para manejo de estado global
- **Componentes personalizados reutilizables**
- **Estilo modular con constantes y assets**

## 📁 Estructura del proyecto
```
gestor-app/
├── assets/ # Imágenes, iconos y otros recursos estáticos
├── components/ # Componentes reutilizables de UI
├── constants/ # Constantes globales (colores, fuentes, etc.)
├── context/ # Archivos de contexto global (Auth, Theme, etc.)
├── screens/ # Pantallas principales de la aplicación
├── types/ # Definiciones e interfaces TypeScript
├── utils/ # Funciones auxiliares reutilizables
├── App.tsx # Punto de entrada de la app
├── package.json # Scripts y dependencias del proyecto
└── tsconfig.json # Configuración de TypeScript
```


## ⚙️ Instalación y ejecución

1. Clona este repositorio:

   ```
   git clone https://github.com/Churrion15/gestor-app.git
   cd gestor-app
   ```
   
Instala las dependencias:
```
npm install
```
Ejecuta la app:
```
npm start
```
Si usas Expo, este comando abrirá el proyecto en el navegador y te permitirá probarlo en un emulador o en tu dispositivo móvil.

🧪 Scripts útiles
npm start: Inicia el servidor de desarrollo.

npm run build: Genera la versión optimizada para producción.

npm run lint: Ejecuta el linter para revisar el código.

✨ Características destacadas
Arquitectura modular y escalable.

Separación clara entre lógica, presentación y datos.

Uso de Context API para manejo eficiente del estado global.

Tipado estricto con TypeScript.

📌 Pendientes o futuras mejoras
Integración con backend o base de datos.

Autenticación de usuarios.

Pruebas automatizadas.

Publicación en App Store / Play Store (si aplica).

🧑‍💻 Autor
Desarrollado por Churrion15.
Contribuciones, sugerencias y mejoras son bienvenidas.
