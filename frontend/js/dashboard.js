function getSelectedGroupId() {
    return document.getElementById("selectGrupo")?.value || localStorage.getItem("grupoSeleccionadoId") || "";
}

function setSelectedGroupName(name) {
    const dashboardTitle = document.querySelector(".dashboard-topbar h1");
    if (dashboardTitle) {
        dashboardTitle.innerText = (name && name !== 'Ninguno seleccionado') ? `Dashboard del grupo ${name}` : 'Dashboard del grupo';
    }
}

function setDashboardEmptyState(show) {
    const emptyState = document.getElementById("dashboardEmptyState");
    const dashboardGrid = document.querySelector(".dashboard-grid");
    const dashboardPanels = document.querySelector(".dashboard-panels");
    const activeSection = document.getElementById("activeEvents")?.closest("section");
    if (emptyState) {
        emptyState.style.display = show ? "block" : "none";
    }
    if (dashboardGrid) {
        dashboardGrid.style.display = show ? "none" : "grid";
    }
    if (dashboardPanels) {
        dashboardPanels.style.display = show ? "none" : "grid";
    }
    if (activeSection) {
        activeSection.style.display = show ? "none" : "block";
    }
}

function cargarDashboard() {
    const grupoId = getSelectedGroupId();
    const groupSummary = document.getElementById("groupSummary");
    const nextEventTitle = document.getElementById("nextEventTitle");
    const nextEventSubtitle = document.getElementById("nextEventSubtitle");
    const membersCount = document.getElementById("membersCount");
    const trainingCount = document.getElementById("trainingCount");
    const attendanceCount = document.getElementById("attendanceCount");
    const recentActivity = document.getElementById("recentActivity");
    const upcomingEvents = document.getElementById("upcomingEvents");
    const activeEvents = document.getElementById("activeEvents");

    if (!grupoId) {
        if (groupSummary) groupSummary.innerHTML = '<p>Selecciona un grupo en la página Grupos para ver estadísticas y progreso.</p>';
        setSelectedGroupName('Ninguno seleccionado');
        if (nextEventTitle) nextEventTitle.innerText = 'Ninguno';
        if (nextEventSubtitle) nextEventSubtitle.innerText = 'Selecciona un grupo para ver el siguiente entrenamiento.';
        if (membersCount) membersCount.innerText = '0';
        if (trainingCount) trainingCount.innerText = '0';
        if (attendanceCount) attendanceCount.innerText = '0';
        if (recentActivity) recentActivity.innerHTML = '<li>No hay actividad para mostrar.</li>';
        if (activeEvents) activeEvents.innerHTML = '<p>Selecciona un grupo en Grupos para ver los entrenamientos activos.</p>';
        if (upcomingEvents) upcomingEvents.innerHTML = '<p>Selecciona un grupo en Grupos para ver los entrenamientos planeados.</p>';        setDashboardEmptyState(true);        return;
    }

    if (!usuario || !usuario.id) {
        if (groupSummary) groupSummary.innerHTML = '<p>Debes iniciar sesión para ver el dashboard del grupo.</p>';
        setSelectedGroupName('No hay grupo seleccionado');
        if (nextEventTitle) nextEventTitle.innerText = 'Ninguno';
        if (nextEventSubtitle) nextEventSubtitle.innerText = 'Debes iniciar sesión para ver información.';
        if (membersCount) membersCount.innerText = '0';
        if (trainingCount) trainingCount.innerText = '0';
        if (attendanceCount) attendanceCount.innerText = '0';
        if (recentActivity) recentActivity.innerHTML = '<li>No hay actividad para mostrar.</li>';
        if (activeEvents) activeEvents.innerHTML = '<p>Inicia sesión para ver los entrenamientos activos.</p>';
        if (upcomingEvents) upcomingEvents.innerHTML = '<p>Inicia sesión para ver los entrenamientos próximos.</p>';
        setDashboardEmptyState(true);
        return;
    }

    fetchWithAuth(API + `/grupos/${grupoId}/dashboard?usuario_id=${usuario.id}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error); });
            }
            return response.json();
        })
        .then(data => {
            const nextEvent = data.proximos_entrenamientos && data.proximos_entrenamientos.length ? data.proximos_entrenamientos[0] : null;
            const activeTrainings = data.entrenamientos_activos || [];
            const groupInfoPromise = data.grupo || data.group || data.group_info
                ? Promise.resolve(data.grupo || data.group || data.group_info)
                : fetchWithAuth(API + `/grupos/${grupoId}`).then(response => {
                    if (!response.ok) {
                        return response.json().then(err => { throw new Error(err.error); });
                    }
                    return response.json();
                });

            if (membersCount) membersCount.innerText = data.total_miembros || 0;
            if (trainingCount) trainingCount.innerText = data.total_entrenamientos || 0;
            if (attendanceCount) attendanceCount.innerText = data.total_asistencias || 0;
            if (nextEventTitle) nextEventTitle.innerText = nextEvent ? `${nextEvent.fecha} ${nextEvent.hora}` : 'Sin eventos';
            if (nextEventSubtitle) nextEventSubtitle.innerText = nextEvent ? `${nextEvent.tipo} en ${nextEvent.ubicacion || 'Ubicación no especificada'}` : 'No hay entrenamientos programados.';

            if (recentActivity) {
                const activityItems = (data.proximos_entrenamientos || []).slice(0, 4).map(evento => {
                    return `<li><strong>${evento.fecha} ${evento.hora}</strong> — ${evento.tipo} ${evento.ubicacion ? `en ${evento.ubicacion}` : ''}</li>`;
                });
                recentActivity.innerHTML = activityItems.length ? activityItems.join('') : '<li>No hay actividad reciente.</li>';
            }

            if (activeEvents) {
                if (activeTrainings.length) {
                    activeEvents.innerHTML = `
                        <div class="upcoming-grid">
                            ${activeTrainings.map(e => {
                                const grupoIdNum = Number(grupoId);
                                const esMiembro = usuario.grupos && usuario.grupos.includes(grupoIdNum);
                                const asistenciaButtons = esMiembro
                                    ? `<div class="attendance-buttons">
                                           <button onclick="dashboardAsistir(${e.id})" class="btn-small btn-success">Asistiré</button>
                                           <button onclick="dashboardNoAsistir(${e.id})" class="btn-small btn-danger">No podré</button>
                                       </div>`
                                    : `<div class="attendance-note">Únete al grupo para marcar asistencia</div>`;

                                return `
                                    <article class="event-card">
                                        <strong>${e.fecha} ${e.hora}</strong>
                                        <p>${e.tipo}</p>
                                        <p>Duración: ${e.duracion || 60} min</p>
                                        <p>${e.ubicacion || 'Ubicación no especificada'}</p>
                                        ${asistenciaButtons}
                                    </article>
                                `;
                            }).join('')}
                        </div>
                    `;
                } else {
                    activeEvents.innerHTML = '<p>No hay entrenamientos activos en este momento.</p>';
                }
            }

            if (upcomingEvents) {
                if (data.proximos_entrenamientos && data.proximos_entrenamientos.length) {
                    upcomingEvents.innerHTML = `
                        <div class="upcoming-grid">
                            ${data.proximos_entrenamientos.map(e => `
                                <article class="event-card">
                                    <strong>${e.fecha} ${e.hora}</strong>
                                    <p>${e.tipo}</p>
                                    <p>${e.ubicacion || 'Ubicación no especificada'}</p>
                                </article>
                            `).join('')}
                        </div>
                    `;
                } else {
                    upcomingEvents.innerHTML = '<p>No hay entrenamientos próximos programados.</p>';
                }
            }

            return groupInfoPromise.then(groupInfo => ({ groupInfo, activeCount: activeTrainings.length }));
        })
        .then(({ groupInfo, activeCount }) => {
            setDashboardEmptyState(false);
            if (groupInfo) {
                setSelectedGroupName(groupInfo.nombre || `Grupo ${grupoId}`);
                if (groupSummary) {
                    groupSummary.innerHTML = `
                        <div class="summary-grid">
                            <div><strong>Nombre:</strong> ${groupInfo.nombre || 'Sin datos'}</div>
                            <div><strong>Tipo:</strong> ${groupInfo.tipo === 'privado' ? 'Privado' : 'Público'}</div>
                            <div><strong>Coordinador principal:</strong> ${groupInfo.creador_nombre || 'No disponible'}</div>
                            <div><strong>Miembros:</strong> ${groupInfo.miembros?.length ?? 'Sin datos'}</div>
                            <div><strong>Entrenamientos totales:</strong> ${groupInfo.total_entrenamientos || 'Sin datos'}</div>
                            <div><strong>Entrenamientos en activo:</strong> ${activeCount}</div>
                        </div>
                        <div class="progress-section">
                            <p>Actividad del grupo en el tiempo</p>
                            <div class="progress-row"><span>Asistencias</span><div class="progress-bar"><div style="width: ${Math.min(100, ((groupInfo.total_asistencias || 0) / Math.max(1, (groupInfo.total_entrenamientos || 1) * Math.max(1, (groupInfo.miembros?.length || 1)))) * 100)}%"></div></div></div>
                        </div>
                    `;
                }
            }
        })
        .catch(err => {
            const messageText = err.message || 'No puedes ver este grupo.';
            setSelectedGroupName(messageText);
            if (groupSummary) groupSummary.innerHTML = `<p>${messageText}</p>`;
            if (activeEvents) activeEvents.innerHTML = '<p>Debes pertenecer al grupo para ver esta información.</p>';
            if (upcomingEvents) upcomingEvents.innerHTML = '<p>Debes pertenecer al grupo para ver esta información.</p>';
            setDashboardEmptyState(false);
        });
}

function renderDashboardPagePlaceholder() {
    // No hay placeholder específico en dashboard.html ahora.
}

// -------- FUNCIONES DE ASISTENCIA EN DASHBOARD --------

function dashboardRegistrar(id, estado) {
    fetchWithAuth(API + "/asistencias", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            entrenamiento_id: id,
            usuario_id: usuario.id,
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
        // mostrarMensaje("success", "Asistencia registrada desde dashboard.");
        cargarDashboard();
    })
    .catch(err => mostrarMensaje("error", err.message));
}

function dashboardAsistir(id) { dashboardRegistrar(id, "asistire"); }
function dashboardNoAsistir(id) { dashboardRegistrar(id, "no_asistire"); }

document.addEventListener('DOMContentLoaded', function() {
    renderDashboardPagePlaceholder();
});
