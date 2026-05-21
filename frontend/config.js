// 🔧 CONFIGURACIÓN GLOBAL - MARQRun Chat
// Cambiar estas URLs según el ambiente

// =============================================
// DEVELOPMENT (Local)
// =============================================
const CONFIG_DEV = {
    API_BASE_URL: 'http://127.0.0.1:5000',
    SOCKET_URL: 'http://127.0.0.1:5000',
    DEBUG_MODE: true,
    LOG_TO_PANEL: true,
    ENVIRONMENT: 'development'
};

// =============================================
// DEVELOPMENT EMULADOR (Android Studio / Oficial)
// =============================================
const CONFIG_DEV_BLUESTACK = {
    API_BASE_URL: 'http://10.0.2.2:5000',
    SOCKET_URL: 'http://10.0.2.2:5000',
    DEBUG_MODE: true,
    LOG_TO_PANEL: true,
    ENVIRONMENT: 'development-emulator'
};

// =============================================
// STAGING (Testing)
// =============================================
const CONFIG_STAGING = {
    API_BASE_URL: 'https://staging.marqun.com',
    SOCKET_URL: 'https://staging.marqun.com',
    DEBUG_MODE: true,
    LOG_TO_PANEL: false,
    ENVIRONMENT: 'staging'
};

// =============================================
// PRODUCTION (Live)
// =============================================
const CONFIG_PRODUCTION = {
    API_BASE_URL: 'https://api.marqun.com',
    SOCKET_URL: 'https://api.marqun.com',
    DEBUG_MODE: false,
    LOG_TO_PANEL: false,
    ENVIRONMENT: 'production'
};

// =============================================
// SELECCIONAR AMBIENTE ACTIVO
// =============================================
// Cambiar aquí según necesites: CONFIG_DEV, CONFIG_DEV_BLUESTACK, CONFIG_STAGING, o CONFIG_PRODUCTION
const CONFIG = CONFIG_DEV_BLUESTACK;

// =============================================
// INFORMACIÓN ÚTIL
// =============================================
// Para cambiar de ambiente:
// 1. Abrir este archivo (config.js)
// 2. Cambiar: const CONFIG = CONFIG_DEV;
//    a: const CONFIG = CONFIG_PRODUCTION;
// 3. Guardar (Ctrl+S)
// 4. Recargar navegador (F5 o Ctrl+Shift+R)

// Para localhost (desarrollo):
// CONFIG_DEV

// Para testing en servidor remoto:
// CONFIG_STAGING

// Para producción final:
// CONFIG_PRODUCTION

console.log(`🔧 Ambiente activo: ${CONFIG.ENVIRONMENT}`);
console.log(`🌐 API: ${CONFIG.API_BASE_URL}`);
