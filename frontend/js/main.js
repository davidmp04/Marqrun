// -------- INICIALIZACIÓN --------

document.addEventListener("DOMContentLoaded", function() {
    const guardado = localStorage.getItem("usuario");
    if (guardado) {
        iniciarSesion(JSON.parse(guardado));
        // No mostrar sección inicial ya que perfil ahora es una página separada
    } else {
        window.location.href = 'login.html';
    }
});