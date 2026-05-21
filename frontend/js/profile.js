// -------- MODAL EDITAR PERFIL --------

let selectedAvatarFile = null;
let croppedAvatarBlob = null;

function abrirModal() {
    const dropdown = document.getElementById("dropdown");
    if (dropdown) {
        dropdown.style.display = "none"; // Cerrar dropdown
    }
    const modal = document.getElementById("editProfileModal");
    if (!modal) return;

    document.getElementById("modalEditNombre").value = usuario.nombre || "";
    document.getElementById("modalEditBio").value = usuario.bio || "";
    document.getElementById("modalEditLocation").value = usuario.location || "";
    document.getElementById("modalEditAvatarUrl").value = usuario.avatar && !usuario.avatar.startsWith('/uploads/') ? usuario.avatar : "";
    document.getElementById("modalEditAvatarFile").value = "";
    selectedAvatarFile = null;
    croppedAvatarBlob = null;
    const cropControls = document.getElementById("avatarCropControls");
    const cropPreviewContainer = document.getElementById("modalAvatarCropPreviewContainer");
    if (cropControls) cropControls.style.display = "none";
    if (cropPreviewContainer) cropPreviewContainer.style.display = "none";
    actualizarAvatarPreviewModal(usuario.avatar);
    modal.style.display = "flex";
}

function cerrarModal() {
    const modal = document.getElementById("editProfileModal");
    if (modal) {
        modal.style.display = "none";
    }
}

function previewAvatarFileModal() {
    const file = document.getElementById("modalEditAvatarFile").files[0];
    const previewContainer = document.getElementById("modalAvatarPreviewContainer");
    const previewImage = document.getElementById("modalAvatarPreviewImage");
    const cropControls = document.getElementById("avatarCropControls");
    const cropPreviewContainer = document.getElementById("modalAvatarCropPreviewContainer");

    croppedAvatarBlob = null;
    selectedAvatarFile = null;
    if (cropPreviewContainer) cropPreviewContainer.style.display = "none";

    if (file) {
        selectedAvatarFile = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = "block";
            if (cropControls) cropControls.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        if (cropControls) cropControls.style.display = "none";
        if (usuario && usuario.avatar) {
            actualizarAvatarPreviewModal(usuario.avatar);
        } else {
            previewContainer.style.display = "none";
            previewImage.src = "";
        }
    }
}

function cropAvatarImage() {
    if (!selectedAvatarFile) {
        mostrarMensaje("error", "Selecciona una imagen antes de recortar.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const size = Math.min(img.width, img.height);
            const sx = (img.width - size) / 2;
            const sy = (img.height - size) / 2;
            const canvas = document.createElement("canvas");
            const outputSize = 256;
            canvas.width = outputSize;
            canvas.height = outputSize;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, sx, sy, size, size, 0, 0, outputSize, outputSize);
            canvas.toBlob(function(blob) {
                if (!blob) {
                    mostrarMensaje("error", "No se pudo recortar la imagen.");
                    return;
                }
                croppedAvatarBlob = blob;
                const previewCropImage = document.getElementById("modalAvatarCropPreviewImage");
                const cropPreviewContainer = document.getElementById("modalAvatarCropPreviewContainer");
                previewCropImage.src = URL.createObjectURL(blob);
                if (cropPreviewContainer) cropPreviewContainer.style.display = "block";
                // mostrarMensaje("success", "Imagen recortada. Ya puedes guardar el perfil.");
            }, "image/png");
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(selectedAvatarFile);
}

function actualizarAvatarPreviewModal(avatarUrl) {
    const previewContainer = document.getElementById("modalAvatarPreviewContainer");
    const previewImage = document.getElementById("modalAvatarPreviewImage");
    if (avatarUrl) {
        previewContainer.style.display = "block";
        previewImage.src = avatarUrl.startsWith('/uploads/') ? API + avatarUrl : avatarUrl;
    } else {
        previewContainer.style.display = "none";
    }
}

function guardarPerfilModal() {
    console.log("guardarPerfilModal called");
    const nuevoNombre = document.getElementById("modalEditNombre").value.trim();
    const nuevoBio = document.getElementById("modalEditBio").value.trim();
    const nuevaLocation = document.getElementById("modalEditLocation").value.trim();
    const nuevoAvatarUrl = document.getElementById("modalEditAvatarUrl").value.trim();
    const avatarFile = document.getElementById("modalEditAvatarFile").files[0];

    if (!nuevoNombre) {
        mostrarMensaje("error", "El nombre no puede estar vacío.");
        return;
    }

    if (nuevoNombre.length < 3 || nuevoNombre.length > 50) {
        mostrarMensaje("error", "El nombre debe tener entre 3 y 50 caracteres.");
        return;
    }

    if (nuevoBio && nuevoBio.length > 300) {
        mostrarMensaje("error", "La biografía no puede exceder 300 caracteres.");
        return;
    }

    if (nuevaLocation && nuevaLocation.length > 100) {
        mostrarMensaje("error", "La ubicación no puede exceder 100 caracteres.");
        return;
    }

    if (nuevoAvatarUrl && nuevoAvatarUrl.length > 500) {
        mostrarMensaje("error", "La URL del avatar no puede exceder 500 caracteres.");
        return;
    }

    if (avatarFile && avatarFile.size > 5 * 1024 * 1024) {
        mostrarMensaje("error", "La imagen no puede exceder 5MB.");
        return;
    }

    const formData = new FormData();
    formData.append("nombre", nuevoNombre);
    formData.append("bio", nuevoBio);
    formData.append("location", nuevaLocation);
    if (croppedAvatarBlob) {
        formData.append("avatar_file", croppedAvatarBlob, "avatar.png");
    } else if (avatarFile) {
        formData.append("avatar_file", avatarFile);
    } else if (nuevoAvatarUrl) {
        formData.append("avatar_url", nuevoAvatarUrl);
    }

    fetchWithAuth(API + `/usuarios/${usuario.id}`, {
        method: "PUT",
        body: formData
    })
    .then(response => {
        console.log("Response received:", response);
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error); });
        }
        return response.json();
    })
    .then(data => {
        console.log("Data received:", data);
        // mostrarMensaje("success", "Perfil actualizado exitosamente.");
        const oldToken = usuario ? usuario.token : null;
        usuario = data.usuario;
        if (oldToken && usuario && !usuario.token) {
            usuario.token = oldToken;
        }
        localStorage.setItem("usuario", JSON.stringify(usuario));
        iniciarSesion(usuario); // Recargar la UI
        cerrarModal();
        // Si estamos en profile.html, recargar la página
        if (window.location.pathname.includes('profile.html')) {
            cargarPerfilCompleto();
        }
    })
    .catch(err => {
        console.error("Error:", err);
        mostrarMensaje("error", err.message);
    });
}

// -------- CARGA DE PERFIL COMPLETO --------

function cargarPerfilCompleto() {
    if (!usuario) return;

    // Actualizar información básica
    document.getElementById("profileName").textContent = usuario.nombre;
    document.getElementById("profileBio").textContent = usuario.bio || "Aún no has escrito una biografía.";
    document.getElementById("profileLocation").textContent = usuario.location ? `📍 ${usuario.location}` : "📍 Ubicación no especificada";

    // Actualizar avatar
    const avatarEl = document.getElementById("profileAvatar");
    if (avatarEl) {
        avatarEl.src = getAvatarUrl(usuario.avatar);
    }

    // Cargar estadísticas
    cargarEstadisticasUsuario();
}

function cargarEstadisticasUsuario() {
    if (!usuario) return;

    // Grupos creados
    fetchWithAuth(API + "/grupos")
    .then(response => response.json())
    .then(grupos => {
        const gruposCreados = grupos.filter(g => g.creador_id === usuario.id).length;
        document.getElementById("gruposCreados").textContent = gruposCreados;
    })
    .catch(err => console.error("Error cargando grupos:", err));

    // Entrenamientos asistidos y creados
    fetchWithAuth(API + "/entrenamientos")
    .then(response => response.json())
    .then(entrenamientos => {
        let asistidos = 0;
        let creados = 0;

        entrenamientos.forEach(ent => {
            // Contar entrenamientos creados
            if (ent.creador_id === usuario.id) {
                creados++;
            }
        });

        document.getElementById("entrenamientosCreados").textContent = creados;

        // Para asistencias, necesitamos hacer otra llamada
        return fetchWithAuth(API + "/asistencias");
    })
    .then(response => response.json())
    .then(asistencias => {
        const asistidos = asistencias.filter(a => a.usuario_id === usuario.id).length;
        document.getElementById("entrenamientosAsistidos").textContent = asistidos;
    })
    .catch(err => console.error("Error cargando estadísticas:", err));
}