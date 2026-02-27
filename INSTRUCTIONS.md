# Instrucciones para Candidatos - Backend Trial

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **npm** (incluido con Node.js)
- Un editor de código (recomendamos VS Code)

## Obtener el Proyecto

### Si recibiste un archivo ZIP:
1. Descomprime el archivo en tu carpeta de trabajo
2. Abre la carpeta en tu editor de código

### Si recibiste un enlace de GitHub:
1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```
2. Entra en la carpeta del proyecto:
   ```bash
   cd <nombre-del-proyecto>
   ```

## Instalación y Ejecución

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**
   ```
   http://localhost:4321
   ```

## Estructura del Proyecto

```
├── src/
│   ├── components/       # Componentes Astro (CardA, CtaB, etc.)
│   ├── js/
│   │   ├── Project.js    # Punto de entrada JS
│   │   ├── Main.js       # Clase principal donde conectar módulos
│   │   └── modules/      # Tus clases JS van aquí
│   ├── layouts/          # Layout principal
│   ├── pages/
│   │   ├── api/          # Endpoints de la API
│   │   └── index.astro   # Página principal (HTML)
│   └── scss/             # Estilos
├── public/               # Assets estáticos
├── EXERCISES.md          # ⭐ LOS EJERCICIOS A REALIZAR
└── package.json
```

## Ejercicios

**Lee el archivo `EXERCISES.md`** para ver los ejercicios que debes completar.

El archivo contiene:
- Descripción detallada de cada ejercicio
- APIs a utilizar
- Requisitos específicos
- Estructura de respuestas esperadas
- Notas importantes sobre el patrón de código de Terra

**Archivos clave para tu implementación:**
- `src/js/Main.js` - Donde conectas tus módulos
- `src/js/modules/` - Donde creas tus clases JS
- `src/pages/index.astro` - HTML de la página (elementos con clases `js--*`)
- `src/pages/api/` - Endpoints de la API

## Tecnologías Utilizadas

- **[Astro](https://docs.astro.build)** - Framework web
- **[@terrahq/design-system](https://www.npmjs.com/package/@terrahq/design-system)** - Sistema de diseño (clases CSS predefinidas)
- **GSAP** - Animaciones
- **Vanilla JavaScript** - Para los ejercicios (NO usar frameworks como React/Vue)

## Consideraciones Importantes

1. **Lee EXERCISES.md primero** - Contiene toda la información necesaria sobre los ejercicios.

2. **No modificar el diseño** - Los estilos ya están definidos. Enfócate en la funcionalidad.

3. **Patrón de clases Terra** - Revisa `Project.js` y `Main.js` para entender la estructura esperada.

4. **Clases `js--*`** - Son selectores para JavaScript, no para estilos. Ya existen en el HTML.

5. **Componentes Astro** - Revisa `CardA.astro` y `CtaB.astro` para ver la estructura HTML que debes replicar en JS.

## Comandos Disponibles

| Comando           | Descripción                              |
|-------------------|------------------------------------------|
| `npm install`     | Instala las dependencias                 |
| `npm run dev`     | Inicia el servidor de desarrollo         |
| `npm run build`   | Compila el proyecto para producción      |
| `npm run preview` | Previsualiza el build de producción      |

## Entrega

1. **Deploy a Netlify** - Comparte la URL de tu proyecto desplegado
2. **Acceso a GitHub** - Danos acceso a tu repositorio para revisar el código: andresclua, NereaFontecha y elisabetperez.

Asegúrate de:
- Realizar commits descriptivos
- Que el proyecto funcione correctamente antes de entregar
- Revisar que no haya errores en la consola

## Dudas

Si tienes alguna duda sobre los ejercicios o el proyecto, no dudes en contactarnos.

---

**Buena suerte!**
