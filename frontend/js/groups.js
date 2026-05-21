// -------- GRUPOS --------

function guardarGrupoSeleccionado(grupoId) {
    if (grupoId) {
        localStorage.setItem("grupoSeleccionadoId", grupoId);
    } else {
        localStorage.removeItem("grupoSeleccionadoId");
    }
}

function restaurarGrupoSeleccionado() {
    const select = document.getElementById("selectGrupo");
    const savedGroupId = localStorage.getItem("grupoSeleccionadoId");
    if (savedGroupId && select) {
        const optionExiste = Array.from(select.options).some(opt => opt.value === savedGroupId);
        if (optionExiste) {
            select.value = savedGroupId;
            onGrupoSeleccionado();
            return true;
        }
    }
    return false;
}

function mostrarConfirmacion(mensaje, onConfirm, titulo = "Confirmación") {
    const modal = document.getElementById("confirmModal");
    const modalTitle = document.getElementById("confirmModalTitle");
    const modalMessage = document.getElementById("confirmModalMessage");
    const okButton = document.getElementById("confirmOkButton");
    const cancelButton = document.getElementById("confirmCancelButton");

    if (!modal || !modalTitle || !modalMessage || !okButton || !cancelButton) {
        console.error("No se encontró el modal de confirmación.");
        if (typeof onConfirm === "function") {
            onConfirm();
        }
        return;
    }

    modalTitle.textContent = titulo;
    modalMessage.textContent = mensaje;

    okButton.onclick = null;
    cancelButton.onclick = null;

    okButton.textContent = "Sí";
    cancelButton.textContent = "No";

    okButton.onclick = () => {
        cerrarConfirmacion();
        if (typeof onConfirm === "function") {
            onConfirm();
        }
    };

    cancelButton.onclick = () => {
        cerrarConfirmacion();
    };

    modal.onclick = (event) => {
        if (event.target === modal) {
            cerrarConfirmacion();
        }
    };

    modal.style.display = "flex";
}

function cerrarConfirmacion() {
    const modal = document.getElementById("confirmModal");
    const okButton = document.getElementById("confirmOkButton");
    const cancelButton = document.getElementById("confirmCancelButton");
    if (modal) {
        modal.style.display = "none";
    }
    if (okButton) {
        okButton.onclick = null;
    }
    if (cancelButton) {
        cancelButton.onclick = null;
    }
}

function cargarGrupos() {
    const select = document.getElementById("selectGrupo");
    if (!select) {
        console.error("No se encontró el select de grupos en la página.");
        return;
    }
    select.innerHTML = "<option value=''>Cargando grupos...</option>";

    fetchWithAuth(API + "/grupos")
        .then(r => {
            if (!r.ok) {
                return r.json().then(err => { throw new Error(err.error || 'Error al cargar grupos'); });
            }
            return r.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('Respuesta de grupos inválida.');
            }

            grupos = data;
            select.innerHTML = "<option value=''>-- Selecciona un grupo --</option>";

            data.forEach(g => {
                const o = document.createElement("option");
                o.value = g.id;
                o.textContent = `${g.nombre} (${g.tipo === 'privado' ? 'Privado' : 'Público'}) - ${g.miembros_count || 0} miembros`;
                select.appendChild(o);
            });

            const cuentaGrupos = data.length;
            const gruposPropios = usuario.grupos ? usuario.grupos.length : 0;
            const gruposDisponiblesEl = document.getElementById("gruposDisponibles");
            const miPerfilEl = document.getElementById("miPerfil");
            if (miPerfilEl) {
                miPerfilEl.innerText = `Usuario: ${usuario.nombre} | Mis grupos: ${gruposPropios} | Grupos disponibles: ${cuentaGrupos}`;
            }

            const grupoStatusEl = document.getElementById("grupoStatus");
            if (grupoStatusEl) {
                grupoStatusEl.innerText = `Grupos cargados: ${cuentaGrupos}. Selecciona uno del desplegable.`;
                grupoStatusEl.style.color = "#555";
            }
            if (gruposDisponiblesEl) {
                gruposDisponiblesEl.innerHTML = `
                    <h4>Todos los grupos disponibles</h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${data.map(g => `<li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;"><strong>${g.nombre}</strong> (${g.tipo === 'privado' ? 'Privado' : 'Público'}) • ${g.miembros_count || 0} miembros</li>`).join('')}
                    </ul>
                `;
            }

            if (data.length === 0) {
                const listaEntrenamientosEl = document.getElementById("listaEntrenamientos");
                if (listaEntrenamientosEl) listaEntrenamientosEl.innerHTML = "<li>No hay grupos disponibles.</li>";
                const dashboardInfoEl = document.getElementById("dashboardInfo");
                if (dashboardInfoEl) dashboardInfoEl.innerText = "Crea o únete a un grupo para ver estadísticas.";
                const grupoDetalleEl = document.getElementById("grupoDetalle");
                if (grupoDetalleEl) grupoDetalleEl.innerText = "Selecciona un grupo para ver detalles.";
                grupoSeleccionado = null;
                guardarGrupoSeleccionado(null);
            } else {
                restaurarGrupoSeleccionado();
            }

            actualizarVisibilidadSecciones();
        })
        .catch(err => {
            mostrarMensaje("error", err.message || "No se pudieron cargar los grupos.");
            select.innerHTML = "<option value=''>No se pudieron cargar los grupos</option>";
            const gruposDisponiblesEl = document.getElementById("gruposDisponibles");
            if (gruposDisponiblesEl) {
                gruposDisponiblesEl.innerHTML = `<p style="color: #d00;">Error cargando grupos. Comprueba la conexión con el servidor.</p>`;
            }
            const grupoStatusEl = document.getElementById("grupoStatus");
            if (grupoStatusEl) {
                grupoStatusEl.innerText = "No se pudieron cargar los grupos. Abre la consola para más detalles.";
                grupoStatusEl.style.color = "#d00";
            }
            console.error(err);
        });
}

function usuarioPuedeCrearGrupos() {
    return usuario && (usuario.rol === "admin" || usuario.rol === "gestor");
}

function actualizarPermisoCrearGrupos() {
    const crearGrupoPanel = document.getElementById("crearGrupoPanel");
    const createGroupNotice = document.getElementById("createGroupNotice");
    if (!crearGrupoPanel || !createGroupNotice) return;

    if (usuarioPuedeCrearGrupos()) {
        crearGrupoPanel.style.display = "block";
        createGroupNotice.innerText = "";
    } else {
        crearGrupoPanel.style.display = "none";
        createGroupNotice.innerText = "Solo administradores o gestores pueden crear nuevos grupos.";
    }
}

function cargarUsuariosAdmin() {
    const adminPanel = document.getElementById("adminPanel");
    const adminUsersList = document.getElementById("adminUsersList");
    if (!adminPanel || !adminUsersList) return;

    if (!usuario || usuario.rol !== "admin") {
        adminPanel.style.display = "none";
        return;
    }

    adminPanel.style.display = "block";
    fetchWithAuth(API + "/usuarios")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudieron cargar los usuarios.");
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error("Respuesta de usuarios inválida.");
            }
            const listHtml = data.map(u => {
                const isAdmin = u.rol === "admin";
                const isSelf = u.id === usuario.id;
                const canChange = !isSelf; // No permitir cambiar el propio rol
                return `
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:0.5rem 0; border-bottom:1px solid #eee;">
                        <div>
                            <strong>${u.nombre}</strong> <span style="color:#555;">(${u.rol})</span>
                        </div>
                        <div>
                            ${canChange ? (isAdmin ? `<button onclick="cambiarRol(${u.id}, 'miembro')" style="padding:0.35rem 0.8rem; border-radius:6px; background:#dc3545; color:white; border:none; cursor:pointer;">Quitar admin</button>` : `<button onclick="cambiarRol(${u.id}, 'admin')" style="padding:0.35rem 0.8rem; border-radius:6px; background:#007bff; color:white; border:none; cursor:pointer;">Promover a admin</button>`) : (isAdmin ? '<span style="color:#28a745; font-weight:600;">Admin (tú)</span>' : '<span style="color:#6c757d;">Miembro (tú)</span>')}
                        </div>
                    </div>
                `;
            }).join("");
            adminUsersList.innerHTML = listHtml || '<p>No hay usuarios para mostrar.</p>';
        })
        .catch(err => {
            adminUsersList.innerHTML = `<p style="color:#d9534f;">${err.message}</p>`;
        });
}

function cambiarRol(usuarioId, nuevoRol) {
    if (!usuario || usuario.rol !== "admin") {
        mostrarMensaje("error", "Solo administradores pueden cambiar roles.");
        return;
    }

    fetchWithAuth(API + `/usuarios/${usuarioId}/cambiar-rol`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ solicitante_id: usuario.id, nuevo_rol: nuevoRol })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || 'Error cambiando rol.'); });
        }
        return response.json();
    })
    .then(data => {
        // mostrarMensaje("success", data.mensaje || `Rol cambiado a ${nuevoRol}.`);
        cargarUsuariosAdmin();
    })
    .catch(err => mostrarMensaje("error", err.message));
}

function crearGrupo() {
    if (!usuarioPuedeCrearGrupos()) {
        mostrarMensaje("error", "No tienes permiso para crear grupos.");
        return;
    }

    const nombre = document.getElementById("nombreGrupo").value.trim();

    if (!nombre) {
        mostrarMensaje("error", "Por favor, ingresa un nombre para el grupo.");
        return;
    }

    if (nombre.length > 50) {
        mostrarMensaje("error", "El nombre del grupo no puede exceder 50 caracteres.");
        return;
    }

    const tipo = document.getElementById("tipoGrupo").value;
    const password = document.getElementById("passwordGrupo").value.trim();

    fetchWithAuth(API + "/grupos", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            nombre,
            creador_id: usuario.id,
            tipo,
            password
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error); });
        }
        return response.json();
    })
    .then(() => {
        // mostrarMensaje("success", "Grupo creado exitosamente.");
        document.getElementById("nombreGrupo").value = "";
        document.getElementById("passwordGrupo").value = "";
        actualizarUsuario();
        cargarGrupos();
    })
    .catch(err => mostrarMensaje("error", err.message));
}

function salirGrupo() {
    const grupoId = getSelectedGroupId();
    if (!grupoId) {
        mostrarMensaje("error", "Selecciona un grupo antes de salir.");
        return;
    }

    mostrarConfirmacion("¿Estás seguro de que quieres salir de este grupo? Esta acción no se podrá deshacer.", () => {
        fetchWithAuth(API + `/grupos/${grupoId}/miembros`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ usuario_id: usuario.id })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error); });
            }
            return response.json();
        })
        .then(() => {
            // mostrarMensaje("success", "Has salido del grupo.");
            actualizarUsuario();
            cargarGrupos();
            onGrupoSeleccionado();
        })
        .catch(err => mostrarMensaje("error", err.message));
    });
}

function borrarGrupo() {
    const grupoId = getSelectedGroupId();
    if (!grupoId) {
        mostrarMensaje("error", "Selecciona un grupo antes de borrarlo.");
        return;
    }

    mostrarConfirmacion("¿Estás seguro de que quieres borrar este grupo? Esta acción no se podrá deshacer.", () => {
        fetch(API + `/grupos/${grupoId}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ usuario_id: usuario.id })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error); });
            }
            return response.json();
        })
        .then(() => {
            // mostrarMensaje("success", "Grupo borrado correctamente.");
            guardarGrupoSeleccionado(null);
            actualizarUsuario();
            cargarGrupos();
            onGrupoSeleccionado();
        })
        .catch(err => mostrarMensaje("error", err.message));
    });
}

function actualizarUsuario() {
    if (!usuario || !usuario.id) {
        return;
    }

    fetchWithAuth(API + `/usuarios/${usuario.id}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error || 'Error actualizando usuario'); });
            }
            return response.json();
        })
        .then(data => {
            if (!data.token && usuario && usuario.token) {
                data.token = usuario.token;
            }
            usuario = data;
            localStorage.setItem("usuario", JSON.stringify(usuario));
            const gruposPropios = usuario.grupos ? usuario.grupos.length : 0;
            let perfilHTML = `Usuario: ${usuario.nombre} | Grupos propios: ${gruposPropios} | Rol: ${usuario.rol || 'miembro'}`;
            if (usuario.location) {
                perfilHTML += ` | Ubicación: ${usuario.location}`;
            }
            if (usuario.bio) {
                perfilHTML += `<br>Bio: ${usuario.bio}`;
            }
            const miPerfil = document.getElementById("miPerfil");
            if (miPerfil) {
                miPerfil.innerHTML = perfilHTML;
            }
            const miPerfil2 = document.getElementById("miPerfil2");
            if (miPerfil2) {
                miPerfil2.innerHTML = perfilHTML;
            }
            // Actualizar bienvenida si cambió
            let bienvenidaHTML = "Hola, " + usuario.nombre;
            const bienvenidaEl = document.getElementById("bienvenida");
            if (bienvenidaEl) {
                bienvenidaEl.innerHTML = bienvenidaHTML;
            }
            if (typeof actualizarRoleBadge === 'function') {
                actualizarRoleBadge(usuario);
            }
            // Update profile pic
            const profilePic = document.getElementById("profilePic");
            if (profilePic) {
                profilePic.src = getAvatarUrl(usuario.avatar);
            }
            actualizarAvatarPreview(usuario.avatar);
            actualizarPermisoCrearGrupos();
            cargarUsuariosAdmin();
        })
        .catch(err => {
            console.error('Error actualizando usuario:', err);
            mostrarMensaje('error', err.message || 'Error actualizando usuario.');
        });
}

function onGrupoSeleccionado() {
    const grupoId = document.getElementById("selectGrupo")?.value || "";
    guardarGrupoSeleccionado(grupoId);

    const listaEntrenamientos = document.getElementById("listaEntrenamientos");
    const dashboardInfo = document.getElementById("dashboardInfo");
    const grupoDetalleEl = document.getElementById("grupoDetalle");
    const entrenamientosTitle = document.getElementById("entrenamientosTitle");
    const passwordUnirme = document.getElementById("passwordUnirme");

    if (!grupoId) {
        if (listaEntrenamientos) listaEntrenamientos.innerHTML = "<li>Selecciona un grupo para ver entrenamientos.</li>";
        if (dashboardInfo) dashboardInfo.innerText = "Selecciona un grupo para ver estadísticas.";
        if (grupoDetalleEl) grupoDetalleEl.innerText = "Selecciona un grupo para ver detalles.";
        if (entrenamientosTitle) entrenamientosTitle.innerText = "Entrenamientos";
        if (passwordUnirme) passwordUnirme.style.display = "none";
        grupoSeleccionado = null;
        actualizarVisibilidadSecciones();
        return;
    }

    actualizarVisibilidadSecciones();
    cargarGrupoDetalle().then(() => {
        cargarEntrenamientos();
        cargarDashboardResumen();
    });
}

function actualizarVisibilidadSecciones() {
    const grupoId = document.getElementById("selectGrupo")?.value || "";
    const tieneGrupo = !!grupoId;

    const sinGrupoMessage = document.getElementById("sinGrupoMessage");
    const crearEntrenamientoCard = document.getElementById("crearEntrenamientoCard");
    const entrenamientosCard = document.getElementById("entrenamientosCard");
    const dashboardCard = document.getElementById("dashboardCard");

    if (sinGrupoMessage) sinGrupoMessage.style.display = tieneGrupo ? "none" : "block";
    if (crearEntrenamientoCard) crearEntrenamientoCard.style.display = "none";
    if (entrenamientosCard) entrenamientosCard.style.display = tieneGrupo ? "block" : "none";
    if (dashboardCard) dashboardCard.style.display = tieneGrupo ? "block" : "none";
}

function cargarGrupoDetalle() {
    const grupoId = document.getElementById("selectGrupo").value;
    if (!grupoId) {
        grupoSeleccionado = null;
        document.getElementById("grupoDetalle").innerText = "Selecciona un grupo para ver detalles.";
        document.getElementById("botonUnirmeGrupo").style.display = "inline-block";
        const botonSalir = document.getElementById("botonSalirGrupo");
        const botonBorrar = document.getElementById("botonBorrarGrupo");
        if (botonSalir) botonSalir.style.display = "none";
        if (botonBorrar) botonBorrar.style.display = "none";
        return;
    }

    return fetch(API + `/grupos/${grupoId}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error); });
            }
            return response.json();
        })
        .then(data => {
            grupoSeleccionado = data;
            const esMiembro = data.miembros.some(m => m.usuario_id === usuario.id);
            const esCoordinador = data.miembros.some(m => m.usuario_id === usuario.id && m.rol === "coordinador");
            const esCoordinadorPrincipal = data.creador_id === usuario.id;
            const boton = document.getElementById("botonUnirmeGrupo");
            const botonSalir = document.getElementById("botonSalirGrupo");
            const botonBorrar = document.getElementById("botonBorrarGrupo");
            if (boton) boton.style.display = esMiembro ? "none" : "inline-block";
            if (botonSalir) botonSalir.style.display = (esMiembro && !esCoordinadorPrincipal) ? "inline-block" : "none";
            if (botonBorrar) botonBorrar.style.display = esCoordinadorPrincipal ? "inline-block" : "none";
            const passwordUnirme = document.getElementById("passwordUnirme");
            if (passwordUnirme) passwordUnirme.style.display = data.tipo === 'privado' && !esMiembro ? 'block' : 'none';

            let miembrosHTML = data.miembros.map(m => {
                let rol = m.rol;
                if (m.usuario_id === data.creador_id && m.rol === "coordinador") {
                    rol = "coordinador principal";
                }
                const avatarSrc = getAvatarUrl(m.avatar);
                const safeAvatarSrc = escapeHtml(avatarSrc);
                const safeName = escapeHtml(m.nombre || 'Usuario');
                let html = `<li style="display: flex; align-items: center; gap: 0.5rem;">
                    <img src="${avatarSrc}" alt="Avatar" class="member-avatar" data-avatar-src="${safeAvatarSrc}" data-member-name="${safeName}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; cursor: pointer;">
                    <span><b>${m.nombre}</b> (${rol})${m.location ? ` • ${m.location}` : ""}${m.bio ? `<br><small>${m.bio}</small>` : ""}</span>`;
                if (esCoordinadorPrincipal && m.usuario_id !== usuario.id) {
                    if (m.rol === 'miembro') {
                        html += ` <button onclick="cambiarRolMiembro(${data.id}, ${m.usuario_id}, 'promover')" style="margin-left: 0.5rem; padding: 0.25rem 0.5rem; font-size: 0.8rem;">Promover a coordinador</button>`;
                    } else if (m.rol === 'coordinador') {
                        html += ` <button onclick="cambiarRolMiembro(${data.id}, ${m.usuario_id}, 'hacer_principal')" style="margin-left: 0.5rem; padding: 0.25rem 0.5rem; font-size: 0.8rem;">Hacer coordinador principal</button>`;
                        html += ` <button onclick="cambiarRolMiembro(${data.id}, ${m.usuario_id}, 'degradar')" style="margin-left: 0.5rem; padding: 0.25rem 0.5rem; font-size: 0.8rem;">Degradar a miembro</button>`;
                    }
                }
                html += `</li>`;
                return html;
            }).join('');

            document.getElementById("grupoDetalle").innerHTML = `
                <div><b>Tipo:</b> ${data.tipo === 'privado' ? 'Privado' : 'Público'}</div>
                <div><b>Coordinador Principal:</b> ${data.creador_nombre || 'Desconocido'}</div>
                <div><b>Miembros:</b> ${data.miembros.length}</div>
                <ul>${miembrosHTML}</ul>
            `;
            attachMemberAvatarLightboxListeners();

            const crearEntrenamientoSection = document.querySelector('[id="dificultadRadios"]')?.closest('.card');
            if (crearEntrenamientoSection) {
                if (!esCoordinador) {
                    crearEntrenamientoSection.style.display = "none";
                } else {
                    crearEntrenamientoSection.style.display = "block";
                    document.querySelectorAll('#dificultadRadios input, #fecha, #hora, #tipo, #ubicacion').forEach(el => { el.disabled = false; });
                    const btnCrear = crearEntrenamientoSection.querySelector('button');
                    if (btnCrear) {
                        btnCrear.disabled = false;
                    }
                }
            }

            document.getElementById("entrenamientosTitle").innerText = `Entrenamientos del grupo ${data.nombre}`;
        })
        .catch(err => {
            const grupoDetalleEl = document.getElementById("grupoDetalle");
            if (grupoDetalleEl) {
                grupoDetalleEl.innerText = err.message;
            }
        });
}

function attachMemberAvatarLightboxListeners() {
    document.querySelectorAll("#grupoDetalle .member-avatar").forEach(img => {
        img.removeEventListener("click", img._avatarLightboxHandler);
        const handler = () => showAvatarLightbox(img.dataset.avatarSrc, img.dataset.memberName);
        img._avatarLightboxHandler = handler;
        img.addEventListener("click", handler);
    });
}

function showAvatarLightbox(src, nombre) {
    const lightbox = document.getElementById("avatarLightbox");
    const image = document.getElementById("avatarLightboxImage");
    const caption = document.getElementById("avatarLightboxCaption");
    image.src = src;
    caption.textContent = nombre || "Miembro";
    lightbox.style.display = "flex";
}

function hideAvatarLightbox() {
    const lightbox = document.getElementById("avatarLightbox");
    lightbox.style.display = "none";
}

function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function cambiarRolMiembro(grupoId, usuarioId, accion) {
    let accionBackend = '';
    if (accion === 'promover') {
        accionBackend = 'cambiar_rol'; // promover a coordinador
    } else if (accion === 'degradar') {
        accionBackend = 'cambiar_rol'; // degradar a miembro
    } else if (accion === 'hacer_principal') {
        accionBackend = 'hacer_principal';
    }

    const ejecutarCambio = () => {
        fetch(API + `/grupos/${grupoId}/promover`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                solicitante_id: usuario.id,
                usuario_id: usuarioId,
                accion: accionBackend
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error); });
            }
            return response.json();
        })
        .then(() => {
            // mostrarMensaje("success", "Rol del usuario modificado.");
            cargarGrupoDetalle();
        })
        .catch(err => mostrarMensaje("error", err.message));
    };

    if (accion === 'hacer_principal') {
        mostrarConfirmacion("Esta acción es irreversible y pasarás a ser coordinador normal del grupo. ¿Continuar?", ejecutarCambio);
        return;
    }

    ejecutarCambio();
}

function unirseGrupo() {
    const grupoId = document.getElementById("selectGrupo").value;

    const passwordUnirme = document.getElementById("passwordUnirme").value.trim();

    fetch(API + `/grupos/${grupoId}/miembros`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            usuario_id: usuario.id,
            password: passwordUnirme
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error); });
        }
        return response.json();
    })
    .then(() => {
        // mostrarMensaje("success", "Te has unido al grupo.");
        actualizarUsuario();
        cargarGrupos();
    })
    .catch(err => mostrarMensaje("error", err.message));
}