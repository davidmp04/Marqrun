# 💬 MARQRun Chat - Aplicación Multiplataforma

Una **aplicación de chat en tiempo real** para MARQRun con soporte para:
- 🌐 **Web (PWA)** - Funciona en cualquier navegador
- 📱 **Android (APK)** - App nativa Android
- 🍎 **iOS (App)** - Aplicación para iPhone/iPad

---

## 🚀 Inicio Rápido

### 1️⃣ **Acceder desde Navegador Web** ✅ (YA FUNCIONA)

```
http://127.0.0.1:5000/frontend/loginchat.html
```

**Features:**
- ✅ Chat en tiempo real
- ✅ Mensajes instantáneos
- ✅ Grupos de chat
- ✅ Funciona offline (PWA)
- ✅ Se instala como app en el navegador

### 2️⃣ **Generar APK Android** 📱

```bash
# Ejecutar script automatizado
build-apk.bat

# O hacerlo manualmente
npm install -g @capacitor/cli
npm install
npx cap init
npx cap add android
npx cap copy
npx cap build android
npx cap open android
```

En Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)

### 3️⃣ **Generar App iOS** 🍎

Requiere Mac con Xcode:
```bash
npx cap add ios
npx cap copy
npx cap open ios
```

---

## 📁 Estructura del Proyecto

```
.
├── backend/
│   ├── app.py              # Servidor Flask + WebSocket + Firebase
│   ├── marqrun-*.json      # Credenciales Firebase
│   └── uploads/            # Avatares de usuarios
├── frontend/
│   ├── loginchat.html      # 🆕 Página de login (entrada)
│   ├── chat.html           # Chat grupal en tiempo real
│   ├── index.html          # Página de inicio
│   ├── manifest.json       # 🆕 Config PWA
│   ├── service-worker.js   # 🆕 Service Worker (offline)
│   ├── styles.css          # Estilos
│   └── app.js              # Scripts principales
├── database/
│   └── marqrun.db          # Base de datos SQLite
├── capacitor.config.json   # 🆕 Config Capacitor
├── package.json            # 🆕 Dependencias npm
├── build-apk.bat           # 🆕 Script para compilar APK
├── BUILD_GUIDE.md          # 🆕 Guía detallada
└── requirements.txt        # Dependencias Python
```

---

## 🌐 URLs de Acceso

| Formato | URL | Estado |
|---------|-----|--------|
| **Web (PWA)** | `http://127.0.0.1:5000/frontend/loginchat.html` | ✅ Listo |
| **Chat** | `http://127.0.0.1:5000/frontend/chat.html` | ✅ Listo |
| **Inicio** | `http://127.0.0.1:5000/frontend/index.html` | ✅ Listo |
| **API** | `http://127.0.0.1:5000/` | ✅ Corriendo |

---

## 📱 Características

- 💬 **Chat en tiempo real** - Mensajes instantáneos con WebSocket
- 👥 **Múltiples grupos** - Organiza conversaciones por grupo
- 🔐 **Autenticación segura** - Login con JWT tokens (24h)
- 🔔 **Notificaciones Push** - Recibe alertas de nuevos mensajes (Firebase)
- 📱 **Responsive Design** - Funciona en móvil, tablet y desktop
- 🌐 **Funciona Offline** - Service Worker cachea contenido
- 🎨 **Interfaz moderna** - Diseño minimalista y limpio
- 📲 **Instalable** - PWA instalable en navegador y móvil

---

## 🔧 Configuración

### URLs de API (Cambiar en producción)

En `loginchat.html` y `chat.html`:
```javascript
const CONFIG = {
    API_BASE_URL: 'http://127.0.0.1:5000', // Cambiar aquí en producción
    SOCKET_URL: 'http://127.0.0.1:5000',
    DEBUG_MODE: true
};
```

### Configuración Capacitor

Ver `capacitor.config.json`:
```json
{
  "appId": "com.marqun.chat",
  "appName": "MARQRun Chat",
  "webDir": "frontend",
  "server": {
    "url": "http://127.0.0.1:5000"  // Cambiar en producción
  }
}
```

---

## 🛠️ Requisitos

### Para Web/PWA:
- ✅ Solo navegador moderno

### Para Android APK:
- Node.js 16+ ([Descargar](https://nodejs.org/))
- Android Studio ([Descargar](https://developer.android.com/studio))
- Java JDK 11+

### Para iOS App:
- Mac con Xcode
- Apple Developer Account

### Backend (Python):
- Python 3.12+
- Flask 3.1+
- SQLAlchemy 2.0+
- Firebase Admin SDK 7.4+
- Socket.IO 5.1+

---

## 📊 Stack Técnico

**Frontend:**
- HTML5, CSS3, JavaScript vanilla
- Socket.IO 4.7.2 (WebSocket)
- PWA (Progressive Web App)
- Service Worker (offline-first)

**Backend:**
- Python 3.12
- Flask 3.1.3
- Flask-SocketIO 5.6.1 (async_mode='threading')
- SQLAlchemy ORM
- SQLite

**Mobile:**
- Capacitor 5.0
- Android SDK
- Xcode (iOS)

**Notificaciones:**
- Firebase Admin SDK 7.4.0
- FCM (Firebase Cloud Messaging)

---

## 🚀 Levantar el Servidor

```bash
cd backend
python app.py
```

Servidor corriendo en: **http://127.0.0.1:5000**

---

## 📲 Instalar como PWA (Sin compilar APK)

### Chrome/Edge/Firefox:
1. Abrir: `http://127.0.0.1:5000/frontend/loginchat.html`
2. Ver icono "Instalar" en la barra de direcciones
3. Hacer clic en "Instalar aplicación"

### Android (Sin APK):
1. Abrir en navegador Chrome
2. Menú ⋮ → "Instalar aplicación"
3. App se añade a la pantalla de inicio

### iPhone (Sin App Store):
1. Abrir en Safari
2. Compartir → "Añadir a pantalla de inicio"
3. App se añade a la pantalla de inicio

---

## 🐛 Debugging

### Ver logs en tiempo real

**Backend:**
```bash
# Los logs aparecen en la terminal donde corre el servidor
python app.py
```

**Frontend:**
- Abre DevTools: F12
- Consola: Ver logs de chat, WebSocket, etc.
- Panel de errores: Disponible en el chat
- Storage: SessionStorage con token

---

## 🔒 Autenticación

- **Tipo:** JWT (JSON Web Tokens)
- **Almacenamiento:** sessionStorage (no persistente)
- **Expiración:** 24 horas
- **Header:** `Authorization: Bearer <token>`

**Flujo:**
1. Usuario ingresa credenciales en `loginchat.html`
2. Backend genera JWT token
3. Token guardado en `sessionStorage`
4. Usuario redirigido a `chat.html`
5. Chat lee token de sessionStorage y conecta WebSocket

**Logout:**
- Borra sessionStorage
- Redirige a `loginchat.html`

---

## 📁 Archivos Nuevos (PWA + Capacitor)

| Archivo | Propósito | Tamaño |
|---------|-----------|--------|
| `loginchat.html` | Página de login (nuevo) | ~5KB |
| `manifest.json` | Metadata PWA | ~2KB |
| `service-worker.js` | Offline support | ~2.5KB |
| `capacitor.config.json` | Config Capacitor | ~200B |
| `package.json` | Dependencias npm | ~1KB |
| `build-apk.bat` | Script para APK | ~3KB |
| `BUILD_GUIDE.md` | Guía detallada | ~5KB |

---

## 📞 Solución de Problemas

### "No puedo conectarme al servidor"
```bash
# Verificar que el servidor está corriendo
python backend/app.py

# Debe mostrar: Running on http://127.0.0.1:5000
```

### "El chat se cierra inmediatamente"
- ✅ **SOLUCIONADO** - Separamos login de chat en `loginchat.html`
- Verifica que estés en: `http://127.0.0.1:5000/frontend/loginchat.html`

### "npm: command not found"
```bash
# Instalar Node.js desde https://nodejs.org/
```

### "Error al compilar APK"
- Ver `BUILD_GUIDE.md` para detalles
- Verificar que tienes Android Studio instalado
- Ejecutar: `build-apk.bat`

### "El Service Worker no se registra"
- Abrir DevTools → Application → Service Workers
- Verificar que estás en HTTPS o localhost
- Revisar la consola por errores

---

## 📄 Documentación Adicional

- `BUILD_GUIDE.md` - Guía completa para compilar APK, APK, y iOS
- `capacitor.config.json` - Configuración de Capacitor
- `package.json` - Scripts npm (build:android, build:ios, etc.)

---

## ✅ Checklist Final

- [x] Web (PWA) funciona
- [x] Login/Chat separado
- [x] Session storage con JWT
- [x] WebSocket estable
- [x] Service Worker activo
- [x] Manifest.json configurado
- [ ] APK Android compilada (ejecutar `build-apk.bat`)
- [ ] App iOS compilada (ejecutar `npx cap open ios`)
- [ ] Deployed en producción

---

## 🎯 Próximos Pasos

1. **Probar en navegador:**
   ```
   http://127.0.0.1:5000/frontend/loginchat.html
   ```

2. **Instalar como PWA:**
   - Botón "Instalar" en navegador
   - O menú ⋮ → "Instalar aplicación"

3. **Generar APK Android:**
   ```bash
   double-click build-apk.bat
   ```

4. **Generar App iOS:**
   ```bash
   npx cap add ios
   npx cap open ios
   # En Xcode: Product → Archive
   ```

5. **Compartir:**
   - APK: Enviar por correo/WhatsApp
   - Web: Compartir enlace
   - iOS: App Store (después de review)

---

**Hecho con ❤️ por MARQRun Team**

**Última actualización:** 20 de abril de 2026  
**Estado:** ✅ PWA lista, Capacitor configurado
