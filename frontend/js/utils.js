// -------- FUNCIONES AUXILIARES --------

// Detectar automáticamente el API_URL basado en donde se carga la página
let API = 'http://127.0.0.1:5000'; // Default

// PRIMERO: Si config.js se cargó con URL personalizada, usarla
if (typeof CONFIG !== 'undefined' && CONFIG.API_BASE_URL) {
    API = CONFIG.API_BASE_URL;
    console.log('✅ config.js cargado - usando API:', API);
}
// Si estamos en Capacitor (app nativa), usar 10.0.2.2
else if (typeof window.Capacitor !== 'undefined') {
    API = 'http://10.0.2.2:5000';
    console.log('🔧 Capacitor detectado - usando 10.0.2.2');
}
// Si estamos cargando desde un servidor (no localhost), usar esa URL como base
else if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Estamos en un servidor remoto (emulador o servidor real)
    API = `http://${window.location.hostname}:${window.location.port || 5000}`;
    console.log('🌐 Detectado servidor remoto:', API);
}
else {
    console.log('⚠️ Usando fallback: 127.0.0.1:5000');
}

console.log('🔗 API Final:', API);

const DEFAULT_AVATAR = "assets/default-avatar.svg";

let usuario = null;
let grupos = [];
let grupoSeleccionado = null;

function getAvatarUrl(avatarUrl) {
    if (!avatarUrl) {
        return DEFAULT_AVATAR;
    }
    return avatarUrl.startsWith('/uploads/') ? API + avatarUrl : avatarUrl;
}

function actualizarAvatarPreview(avatarUrl) {
    const previewContainer = document.getElementById("avatarPreviewContainer");
    const previewImage = document.getElementById("avatarPreviewImage");
    if (!previewContainer || !previewImage) {
        return;
    }
    if (avatarUrl) {
        previewContainer.style.display = "block";
        previewImage.src = avatarUrl.startsWith('/uploads/') ? API + avatarUrl : avatarUrl;
    } else {
        previewContainer.style.display = "none";
        previewImage.src = "";
    }
}

function mostrarMensaje(tipo, texto) {
    const msgDiv = document.getElementById("mensaje");
    msgDiv.className = `mensaje ${tipo}`;
    msgDiv.textContent = texto;
    msgDiv.style.display = "block";
    setTimeout(() => msgDiv.style.display = "none", 5000); // Ocultar después de 5s
}