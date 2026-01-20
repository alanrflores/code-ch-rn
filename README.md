# Toolbox Challenge - React Native

Aplicación React Native que consume un API REST para mostrar carruseles de contenido multimedia con reproducción de video.

## Requisitos Previos

- **Node.js** >= 20
- **npm** >= 9
- **Xcode** >= 15 (para iOS)
- **Android Studio** con SDK 34+ (para Android)
- **JDK 17** (Zulu recomendado)
- **CocoaPods** >= 1.14

### Variables de Entorno (macOS)

Asegurate de tener estas variables en tu `~/.zshrc` o `~/.bashrc`:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/emulator"
export PATH="$PATH:$ANDROID_HOME/platform-tools"
```

## Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd ToolboxChallenge

# 2. Instalar dependencias de Node
npm install

# 3. Instalar pods para iOS
cd ios && pod install && cd ..
```

## Ejecución

### iOS (Simulator)

```bash
npm run ios
# o especificando un simulador
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### Android (Emulator)

```bash
# Asegurate de tener un emulador corriendo o un dispositivo conectado
npm run android
```

### Metro Bundler (si no inicia automáticamente)

```bash
npm start
```

## Testing

```bash
# Ejecutar todos los tests
npm test

# Con coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## Estructura del Proyecto

```
src/
├── api/                    # Capa de servicios HTTP
│   ├── client.js           # Axios client con interceptors
│   ├── authService.js      # Autenticación
│   └── carouselService.js  # Datos de carruseles
│
├── store/                  # Redux Toolkit
│   ├── index.js            # Store configuration
│   └── slices/
│       ├── authSlice.js    # Estado de autenticación
│       └── carouselSlice.js # Estado de carruseles
│
├── hooks/                  # Custom hooks
│   ├── useAuth.js          # Hook de autenticación
│   └── useCarousels.js     # Hook de carruseles
│
├── components/             # Componentes presentacionales
│   ├── Carousel/
│   │   ├── index.js        # Factory component
│   │   ├── PosterCarousel.js
│   │   ├── ThumbCarousel.js
│   │   └── CarouselItem.js
│   ├── VideoPlayer/
│   │   └── index.js
│   └── common/
│       ├── LazyImage.js
│       └── LoadingSpinner.js
│
├── screens/                # Contenedores
│   └── HomeScreen.js
│
└── utils/
    ├── constants.js
    └── tokenManager.js     # Manejo de JWT
```

## Arquitectura

### Principios SOLID Aplicados

1. **Single Responsibility**: Cada módulo tiene una única responsabilidad
   - `authService` solo maneja autenticación
   - `carouselService` solo maneja datos de carruseles
   - Cada componente tiene un propósito específico

2. **Open/Closed**: Extensible sin modificar código existente
   - El factory `Carousel` permite agregar nuevos tipos sin modificar código existente
   - Los interceptors de Axios permiten extender comportamiento

3. **Interface Segregation**: Los hooks exponen solo lo necesario
   - `useAuth` expone `login`, `logout`, `isAuthenticated`
   - `useCarousels` expone `carousels`, `selectItem`, `refetch`

4. **Dependency Inversion**: Las capas superiores no dependen de las inferiores
   - Los componentes dependen de hooks, no de Redux directamente
   - Los hooks dependen de servicios abstractos

### Patrón Container-Presentational

- **Containers** (screens): Conectan lógica con UI
- **Presentational** (components): Solo reciben props y renderizan

### Flujo de Datos

```
User Action → Component → Hook → Redux Action → API Service → Redux State → Component Update
```

## API

### Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/v1/mobile/auth` | POST | Obtener token de autenticación |
| `/v1/mobile/data` | GET | Obtener datos de carruseles |

### Autenticación

El token JWT se obtiene enviando:
```json
{ "sub": "ToolboxMobileTest" }
```
El token incluye un campo `expireDate` que se usa para refrescar automáticamente antes de que expire.

## Dependencias Principales

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| react-native | 0.83.1 | Framework |
| @reduxjs/toolkit | ^2.5.1 | State management |
| react-redux | ^9.2.0 | React bindings para Redux |
| axios | ^1.7.9 | HTTP client |
| react-native-video | ^6.9.0 | Reproductor de video |
| react-native-safe-area-context | ^5.5.2 | Safe area handling |

## Nota

### Imágenes del API

El API devuelve URLs de imágenes que apuntan a `http://placeimg.com`:

```json
{
  "imageUrl": "http://placeimg.com/640/480/any"
}
```

**Problema:** El dominio `placeimg.com` fue discontinuado y ya no resuelve en DNS:

```bash
$ nslookup placeimg.com
*** Can't find placeimg.com: No answer

$ curl http://placeimg.com/640/480/any
curl: (6) Could not resolve host: placeimg.com
```

**Solución implementada:** Se reemplazaron las URLs por imágenes de `https://picsum.photos`, un servicio de placeholder activo. El código está preparado para usar las URLs originales del API cuando el servicio de imágenes sea actualizado.

---

## Troubleshooting

### iOS: "No bundle URL present"
```bash
cd ios && pod install && cd ..
npm start --reset-cache
```

### Android: "Unable to load script"
```bash
npx react-native start --reset-cache
# En otra terminal:
npx react-native run-android
```

### Metro: "EADDRINUSE"
```bash
# Matar proceso en puerto 8081
lsof -i :8081 | awk 'NR>1 {print $2}' | xargs kill -9
```

## Autor

Challenge desarrollado para Toolbox

## Licencia

Privado - Solo para evaluación
