// -------- ENTRENAMIENTOS --------

// Variables para filtros
let filtrosAplicados = {
    tipo: '',
    fechaDesde: '',
    fechaHasta: '',
    ubicacion: ''
};

// Variables para calendario
let currentCalendarDate = new Date();
let entrenamientosData = [];

function getSelectedGroupId() {
    return document.getElementById("selectGrupo")?.value || localStorage.getItem("grupoSeleccionadoId") || "";
}

function setSelectedGroupLabel(name) {
    const title = document.getElementById("selectedGroupTitle");
    const label = document.getElementById("selectedGroupLabel");
    if (title) {
        title.innerText = name ? `Entrenamientos del grupo ${name}` : 'Entrenamientos del grupo';
    }
    if (label) {
        label.innerText = 'La información se sincroniza con el grupo seleccionado en la página Grupos.';
    }
}

function cargarEntrenamientos() {
    const grupoId = getSelectedGroupId();
    const listaProximos = document.getElementById("listaEntrenamientos");
    const listaAnteriores = document.getElementById("listaEntrenamientosAnteriores");
    const notice = document.getElementById("trainingsNotice");
    const crearEntrenamientoPanel = document.querySelector(".training-panel");
    const crearButton = crearEntrenamientoPanel?.querySelector("button.primary");
    const formInputs = crearEntrenamientoPanel?.querySelectorAll("input, input[type='radio']");

    function setNotice(message) {
        if (notice) notice.innerText = message;
    }

    if (!grupoId) {
        setSelectedGroupLabel("");
        if (listaProximos) listaProximos.innerHTML = "<li style='padding: 1rem; text-align: center; color: #999;'>Selecciona un grupo para ver entrenamientos.</li>";
        if (listaAnteriores) listaAnteriores.innerHTML = "<li style='padding: 1rem; text-align: center; color: #999;'>No hay entrenamientos anteriores.</li>";
        if (crearButton) crearButton.disabled = true;
        if (formInputs) formInputs.forEach(input => input.disabled = true);
        const emptyState = document.getElementById("trainingEmptyState");
        const content = document.getElementById("trainingContent");
        if (emptyState) emptyState.style.display = "block";
        if (content) content.style.display = "none";
        entrenamientosData = []; // Limpiar datos
        renderizarCalendario(); // Renderizar calendario vacío
        return;
    }

    const emptyState = document.getElementById("trainingEmptyState");
    const content = document.getElementById("trainingContent");
    if (emptyState) emptyState.style.display = "none";
    if (content) content.style.display = "block";

    function loadGrupoSeleccionado(id) {
        if (grupoSeleccionado && String(grupoSeleccionado.id) === String(id)) {
            return Promise.resolve(grupoSeleccionado);
        }
        return fetchWithAuth(API + `/grupos/${id}`)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error); });
                }
                return response.json();
            })
            .then(data => {
                grupoSeleccionado = data;
                return data;
            });
    }

    const grupoIdNum = Number(grupoId);
    const esMiembro = usuario.grupos && usuario.grupos.includes(grupoIdNum);

    loadGrupoSeleccionado(grupoId)
        .then(grupo => {
            setSelectedGroupLabel(grupo.nombre);

            const esCoordinador = grupo.miembros.some(m => m.usuario_id === usuario.id && m.rol === "coordinador");
            const esPrincipal = grupo.creador_id === usuario.id;

            const puedeCrear = esCoordinador || esPrincipal;
            if (crearButton) crearButton.disabled = !puedeCrear;
            if (formInputs) {
                formInputs.forEach(input => input.disabled = !puedeCrear);
            }

            if (crearEntrenamientoPanel) {
                crearEntrenamientoPanel.style.opacity = puedeCrear ? "1" : "0.5";
                crearEntrenamientoPanel.style.pointerEvents = puedeCrear ? "auto" : "none";
            }

            if (grupo.tipo === "privado" && !esMiembro) {
                const passwordUnirme = document.getElementById("passwordUnirme")?.value.trim();
                if (!passwordUnirme) {
                    setNotice("Para ver los entrenamientos debes pertenecer al grupo.");
                    if (listaProximos) listaProximos.innerHTML = "<li>No puedes ver los entrenamientos de este grupo.</li>";
                    if (listaAnteriores) listaAnteriores.innerHTML = "<li>No puedes ver los entrenamientos de este grupo.</li>";
                    return;
                }

                setNotice("");
                return fetchWithAuth(API + "/entrenamientos/" + grupoId + `?password=${encodeURIComponent(passwordUnirme)}`)
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(err => { throw new Error(err.error); });
                        }
                        return response.json();
                    })
                    .then(data => {
                        entrenamientosData = data; // Guardar datos para el calendario
                        renderizarEntrenamientos(data, esMiembro, esCoordinador, esPrincipal, listaProximos, listaAnteriores);
                        renderizarCalendario(); // Renderizar calendario con los datos
                    });
            }

            setNotice("");
            return fetchWithAuth(API + "/entrenamientos/" + grupoId + `?usuario_id=${usuario.id}`)
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => { throw new Error(err.error); });
                    }
                    return response.json();
                })
                .then(data => {
                    entrenamientosData = data; // Guardar datos para el calendario
                    renderizarEntrenamientos(data, esMiembro, esCoordinador, esPrincipal, listaProximos, listaAnteriores);
                    renderizarCalendario(); // Renderizar calendario con los datos
                });
        })
        .catch(err => {
            if (notice) notice.innerText = err.message;
            if (listaProximos) listaProximos.innerHTML = "<li>Error cargando entrenamientos.</li>";
            console.error(err);
        });
}

function renderizarEntrenamientos(data, esMiembro, esCoordinador, esPrincipal, listaProximos, listaAnteriores) {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    let proximosList = [];
    let anterioresList = [];
    const botonAsistenciaDisabled = !esMiembro;

    // Aplicar filtros a los datos
    const datosFiltrados = data.filter(e => {
        // Filtro por tipo
        if (filtrosAplicados.tipo && !e.tipo.toLowerCase().includes(filtrosAplicados.tipo.toLowerCase())) {
            return false;
        }

        // Filtro por ubicación
        if (filtrosAplicados.ubicacion && !e.ubicacion?.toLowerCase().includes(filtrosAplicados.ubicacion.toLowerCase())) {
            return false;
        }

        // Filtro por fecha desde
        if (filtrosAplicados.fechaDesde && e.fecha < filtrosAplicados.fechaDesde) {
            return false;
        }

        // Filtro por fecha hasta
        if (filtrosAplicados.fechaHasta && e.fecha > filtrosAplicados.fechaHasta) {
            return false;
        }

        return true;
    });

    datosFiltrados.forEach(e => {
        let eventDateTime;
        if (e.fecha && e.hora) {
            eventDateTime = new Date(`${e.fecha}T${e.hora}`);
        } else if (e.fecha) {
            eventDateTime = new Date(`${e.fecha}T00:00`);
        } else {
            eventDateTime = new Date(0);
        }

        if (eventDateTime >= now) {
            proximosList.push(e);
        } else {
            anterioresList.push(e);
        }
    });

    if (listaProximos) {
        if (proximosList.length === 0) {
            listaProximos.innerHTML = "<li style='padding: 1rem; text-align: center; color: #999;'>No hay próximos entrenamientos.</li>";
        } else {
            listaProximos.innerHTML = "";
            proximosList.forEach(e => {
                const li = document.createElement("li");
                const puedeBorrar = esPrincipal || (esCoordinador && e.usuario_id === usuario.id);

                const asistenciaButtons = botonAsistenciaDisabled
                    ? `<div style="margin-top: 0.5rem; font-size: 0.9rem; color: #555;">Debes unirte al grupo para poder marcar asistencia.</div>`
                    : `<button onclick="asistir(${e.id})">Asistiré</button>
                       <button onclick="noAsistir(${e.id})">No podré</button>`;

                li.innerHTML = `
                    <div class="card">
                        <b>${e.fecha} ${e.hora}</b><br>
                        Creado por: ${e.creador_nombre}<br>
                        ${e.tipo} - ${e.ubicacion || "Sin ubicación"} - ${e.dificultad || "Dificultad no especificada"}<br>
                        Duración: ${e.duracion || 60} min

                        ${asistenciaButtons}

                        ${puedeBorrar ? `<button onclick="borrar(${e.id})">Eliminar</button>` : ""}

                        <ul id="a-${e.id}"></ul>
                    </div>
                `;

                listaProximos.appendChild(li);
                cargarAsistencias(e.id);
            });
        }
    }

    if (listaAnteriores) {
        if (anterioresList.length === 0) {
            listaAnteriores.innerHTML = "<li style='padding: 1rem; text-align: center; color: #999;'>No hay entrenamientos anteriores.</li>";
        } else {
            listaAnteriores.innerHTML = "";
            anterioresList.forEach(e => {
                const li = document.createElement("li");
                const puedeBorrar = esPrincipal || (esCoordinador && e.usuario_id === usuario.id);

                li.innerHTML = `
                    <div class="card">
                        <b>${e.fecha} ${e.hora}</b><br>
                        Creado por: ${e.creador_nombre}<br>
                        ${e.tipo} - ${e.ubicacion || "Sin ubicación"} - ${e.dificultad || "Dificultad no especificada"}<br>
                        Duración: ${e.duracion || 60} min

                        ${puedeBorrar ? `<button onclick="borrar(${e.id})">Eliminar</button>` : ""}

                        <ul id="a-${e.id}"></ul>
                    </div>
                `;

                listaAnteriores.appendChild(li);
                cargarAsistencias(e.id);
            });
        }
    }
}

function crearEntrenamiento() {
    const grupoId = getSelectedGroupId();
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const tipo = document.getElementById("tipo").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();
    const today = new Date().toISOString().split("T")[0];

    if (!grupoId) {
        mostrarMensaje("error", "Selecciona un grupo primero.");
        return;
    }

    const grupoIdNum = Number(grupoId);
    if (!usuario.grupos || !usuario.grupos.includes(grupoIdNum)) {
        mostrarMensaje("error", "Debes ser miembro del grupo para crear entrenamientos.");
        return;
    }

    if (!grupoSeleccionado || !grupoSeleccionado.miembros.some(m => m.usuario_id === usuario.id && m.rol === "coordinador")) {
        mostrarMensaje("error", "Solo los coordinadores del grupo pueden crear entrenamientos.");
        return;
    }

    if (!fecha) {
        mostrarMensaje("error", "Por favor, selecciona una fecha.");
        return;
    }

    if (fecha < today) {
        mostrarMensaje("error", "No puedes crear entrenamientos en fechas anteriores a hoy.");
        return;
    }

    if (!hora) {
        mostrarMensaje("error", "Por favor, selecciona una hora.");
        return;
    }

    const selectedDateTime = new Date(`${fecha}T${hora}`);
    const now = new Date();
    if (selectedDateTime < now) {
        mostrarMensaje("error", "No puedes crear entrenamientos en una fecha y hora anteriores a la actual.");
        return;
    }

    if (!tipo) {
        mostrarMensaje("error", "Por favor, ingresa el tipo de entrenamiento.");
        return;
    }

    if (tipo.length > 50) {
        mostrarMensaje("error", "El tipo no puede exceder 50 caracteres.");
        return;
    }

    const duracionValor = document.getElementById("duracion").value;
    const duracion = parseInt(duracionValor, 10);
    if (!duracionValor || Number.isNaN(duracion) || duracion <= 0) {
        mostrarMensaje("error", "Por favor, ingresa una duración válida en minutos.");
        return;
    }

    if (duracion > 1440) {
        mostrarMensaje("error", "La duración no puede exceder 1440 minutos.");
        return;
    }

    const dificultad = document.querySelector('input[name="dificultad"]:checked')?.value || "";

    if (ubicacion.length > 100) {
        mostrarMensaje("error", "La ubicación no puede exceder 100 caracteres.");
        return;
    }

    fetchWithAuth(API + "/entrenamientos", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            fecha,
            hora,
            tipo,
            duracion,
            ubicacion,
            dificultad,
            grupo_id: grupoId
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error); });
        }
        return response.json();
    })
    .then(() => {
        // mostrarMensaje("success", "Entrenamiento creado exitosamente.");
        cargarEntrenamientos();
        cargarDashboard();
        document.getElementById("fecha").value = "";
        document.getElementById("hora").value = "";
        document.getElementById("duracion").value = "60";
        document.getElementById("tipo").value = "";
        document.getElementById("ubicacion").value = "";
        document.querySelectorAll('input[name="dificultad"]').forEach(rb => rb.checked = false);
    })
    .catch(err => mostrarMensaje("error", err.message));
}

// -------- ASISTENCIAS --------

function registrar(id, estado) {
    fetchWithAuth(API + "/asistencias", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            entrenamiento_id: id,
            estado
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error); });
        }
        return response.json();
    })
    .then(() => {
        // mostrarMensaje("success", "Asistencia registrada.");
        cargarEntrenamientos();
        cargarDashboard();
    })
    .catch(err => mostrarMensaje("error", err.message));
}

function asistir(id) { registrar(id, "asistire"); }
function noAsistir(id) { registrar(id, "no_asistire"); }

function cargarAsistencias(id) {
    fetchWithAuth(API + "/asistencias/" + id)
        .then(r => r.json())
        .then(data => {
            const lista = document.getElementById("a-" + id);
            if (!lista) return;
            
            lista.innerHTML = "";

            data.forEach(a => {
                const li = document.createElement("li");
                li.textContent = `${a.usuario_nombre}: ${a.estado}`;
                lista.appendChild(li);
            });
        })
        .catch(err => console.error("Error cargando asistencias:", err));
}

// -------- BORRAR --------

function borrar(id) {
    fetchWithAuth(API + "/entrenamientos/" + id, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({})
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error); });
        }
        return response.json();
    })
    .then(() => {
        // mostrarMensaje("success", "Entrenamiento eliminado exitosamente.");
        cargarEntrenamientos();
        cargarDashboard();
    })
    .catch(err => mostrarMensaje("error", err.message));
}

// -------- FUNCIONES DE FILTROS --------

function aplicarFiltros() {
    filtrosAplicados.tipo = document.getElementById("filtroTipo").value.trim();
    filtrosAplicados.fechaDesde = document.getElementById("filtroFechaDesde").value;
    filtrosAplicados.fechaHasta = document.getElementById("filtroFechaHasta").value;
    filtrosAplicados.ubicacion = document.getElementById("filtroUbicacion").value.trim();

    cargarEntrenamientos();
}

function limpiarFiltros() {
    filtrosAplicados = {
        tipo: '',
        fechaDesde: '',
        fechaHasta: '',
        ubicacion: ''
    };

    document.getElementById("filtroTipo").value = '';
    document.getElementById("filtroFechaDesde").value = '';
    document.getElementById("filtroFechaHasta").value = '';
    document.getElementById("filtroUbicacion").value = '';

    cargarEntrenamientos();
}

// -------- FUNCIONES DEL CALENDARIO --------

function cambiarMes(delta) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    renderizarCalendario();
}

function renderizarCalendario() {
    const calendar = document.getElementById("calendar");
    const calendarTitle = document.getElementById("calendarTitle");

    if (!calendar || !calendarTitle) return;

    // Actualizar título del calendario
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    calendarTitle.textContent = `${monthNames[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`;

    // Crear estructura del calendario
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    // Día de la semana del primer día (0 = Domingo, 1 = Lunes, etc.)
    const startDayOfWeek = firstDay.getDay();

    // Crear array de días
    const days = [];

    // Días del mes anterior para completar la primera semana
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        days.push({
            day: prevMonthLastDay - i,
            month: month - 1,
            year: month === 0 ? year - 1 : year,
            isCurrentMonth: false
        });
    }

    // Días del mes actual
    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push({
            day: day,
            month: month,
            year: year,
            isCurrentMonth: true
        });
    }

    // Días del mes siguiente para completar la última semana
    const remainingCells = 42 - days.length; // 6 semanas * 7 días = 42 celdas
    for (let day = 1; day <= remainingCells; day++) {
        days.push({
            day: day,
            month: month + 1,
            year: month === 11 ? year + 1 : year,
            isCurrentMonth: false
        });
    }

    // Renderizar días
    calendar.innerHTML = `
        <div class="calendar-day calendar-day-header">L</div>
        <div class="calendar-day calendar-day-header">M</div>
        <div class="calendar-day calendar-day-header">X</div>
        <div class="calendar-day calendar-day-header">J</div>
        <div class="calendar-day calendar-day-header">V</div>
        <div class="calendar-day calendar-day-header">S</div>
        <div class="calendar-day calendar-day-header">D</div>
        ${days.map(dayInfo => {
            const dateStr = `${dayInfo.year}-${String(dayInfo.month + 1).padStart(2, '0')}-${String(dayInfo.day).padStart(2, '0')}`;
            const today = new Date().toISOString().split('T')[0];
            const isToday = dateStr === today;

            // Filtrar entrenamientos para este día
            const dayEvents = entrenamientosData.filter(e => e.fecha === dateStr);

            return `
                <div class="calendar-day ${!dayInfo.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}">
                    <div class="calendar-day-number">${dayInfo.day}</div>
                    ${dayEvents.map(event => `
                        <div class="calendar-event" title="${event.tipo} - ${event.ubicacion || 'Sin ubicación'}">
                            ${event.tipo.length > 8 ? event.tipo.substring(0, 8) + '...' : event.tipo}
                        </div>
                    `).join('')}
                </div>
            `;
        }).join('')}
    `;
}
