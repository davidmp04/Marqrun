// -------- LOGIN --------

function getAuthToken() {
    const stored = localStorage.getItem("usuario");
    if (stored) {
        try {
            const user = JSON.parse(stored);
            return user.token || null;
        } catch (e) {
            return null;
        }
    }
    return null;
}

function fetchWithAuth(url, options = {}) {
    // Helper para hacer fetch con token JWT automáticamente
    const token = getAuthToken();
    const headers = options.headers || {};
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return fetch(url, { ...options, headers });
}

function login() {
    const nombre = document.getElementById("loginNombre").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!nombre || !password) {
        mostrarMensaje("error", "Por favor, ingresa nombre de usuario y contraseña.");
        return;
    }

    fetch(API + "/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nombre, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error); });
        }
        return response.json();
    })
    .then(user => {
        // mostrarMensaje("success", `Bienvenido ${user.nombre}.`);
        document.getElementById("loginPassword").value = "";
        iniciarSesion(user);
    })
    .catch(err => mostrarMensaje("error", err.message));
}

function actualizarRoleBadge(user) {
    const roleBadge = document.getElementById("userRoleBadge");
    const roleLabelDashboard = document.getElementById("userRoleLabelDashboard");
    const role = (user && user.rol) ? user.rol.toLowerCase() : "miembro";
    if (roleBadge) {
        roleBadge.innerText = role.toUpperCase();
        roleBadge.className = `role-badge ${role === 'admin' ? 'admin' : role === 'gestor' ? 'gestor' : role === 'coordinador' ? 'coordinador' : 'miembro'}`;
    }
    if (roleLabelDashboard) {
        roleLabelDashboard.innerText = `Rol: ${role}`;
    }
}

function register() {
    const nombre = document.getElementById("loginNombre").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const passwordConfirm = document.getElementById("loginPasswordConfirm").value.trim();

    if (!nombre || !password || !passwordConfirm) {
        mostrarMensaje("error", "Por favor, completa todos los campos.");
        return;
    }

    if (password !== passwordConfirm) {
        mostrarMensaje("error", "Las contraseñas no coinciden.");
        return;
    }

    if (password.length < 6) {
        mostrarMensaje("error", "La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    fetch(API + "/usuarios", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nombre, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error); });
        }
        return response.json();
    })
    .then(() => {
        // mostrarMensaje("success", "Usuario registrado. Ahora inicia sesión.");
        document.getElementById("loginPassword").value = "";
        document.getElementById("loginPasswordConfirm").value = "";
        // Redirigir a login después de registrarse exitosamente
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    })
    .catch(err => mostrarMensaje("error", err.message));
}

function iniciarSesion(user) {
    usuario = user;

    localStorage.setItem("usuario", JSON.stringify(user));

    const profilePic = document.getElementById("profilePic");
    if (profilePic) {
        profilePic.src = getAvatarUrl(user.avatar);
    }

    const appEl = document.getElementById("app");
    const profileContainer = document.querySelector(".profile-container");
    const dashboardPage = document.querySelector(".dashboard-page");
    const trainingsPage = document.querySelector(".trainings-page");
    const adminPage = document.querySelector(".admin-page");
    const roleLabelDashboard = document.getElementById("userRoleLabelDashboard");

    if (roleLabelDashboard) {
        roleLabelDashboard.innerText = `Rol: ${user.rol || 'miembro'}`;
    }

    const adminNavLink = document.getElementById("adminNavLink");
    if (adminNavLink) {
        adminNavLink.style.display = (user.rol === 'admin') ? 'block' : 'none';
    }

    const adminDropdownButton = document.getElementById("adminDropdownButton");
    if (adminDropdownButton) {
        adminDropdownButton.style.display = (user.rol === 'admin') ? 'block' : 'none';
    }

    actualizarRoleBadge(user);

    if (appEl) {
        // Estamos en index.html, mostrar la UI
        // mostrarMensaje("success", `Bienvenido ${user.nombre}.`);

        const loginBox = document.getElementById("loginBox");
        if (loginBox) {
            loginBox.style.display = "none";
        }
        appEl.style.display = "block";

        let bienvenidaHTML = "Hola, " + user.nombre;
        const bienvenidaEl = document.getElementById("bienvenida");
        if (bienvenidaEl) {
            bienvenidaEl.innerHTML = bienvenidaHTML;
        }

        // Set profile pic
        const profilePic = document.getElementById("profilePic");
        if (profilePic) {
            profilePic.src = getAvatarUrl(user.avatar);
        }

        const gruposPropios = usuario.grupos ? usuario.grupos.length : 0;
        let perfilHTML = `Usuario: ${user.nombre} | Grupos propios: ${gruposPropios}`;
        if (user.location) {
            perfilHTML += ` | Ubicación: ${user.location}`;
        }
        if (user.bio) {
            perfilHTML += `<br>Bio: ${user.bio}`;
        }
        const miPerfil = document.getElementById("miPerfil");
        if (miPerfil) {
            miPerfil.innerHTML = perfilHTML;
        }
        const miPerfil2 = document.getElementById("miPerfil2");
        if (miPerfil2) {
            miPerfil2.innerHTML = perfilHTML;
        }

        actualizarAvatarPreview(user.avatar);

        // Refrescar usuario y luego cargar los grupos existentes.
        actualizarUsuario();
        cargarGrupos();
    } else if (dashboardPage) {
        // Estamos en dashboard.html, cargar datos sin redirigir
        cargarDashboard();
    } else if (trainingsPage) {
        // Estamos en entrenamientos.html, cargar entrenamientos sin redirigir
        cargarEntrenamientos();
    } else if (profileContainer) {
        // Estamos en profile.html, no hacer nada especial
        // La página se encargará de cargar el perfil
    } else if (adminPage) {
        // Estamos en admin.html, no redirigir
    } else {
        // Estamos en login.html o register.html, redirigir a index.html
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem("usuario");
    window.location.href = 'login.html';
}

// -------- AUTO LOGIN --------

function comprobarSesion() {
    const guardado = localStorage.getItem("usuario");

    if (guardado) {
        iniciarSesion(JSON.parse(guardado));
    }
}