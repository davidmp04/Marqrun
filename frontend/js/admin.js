document.addEventListener('DOMContentLoaded', function() {
    const guardado = localStorage.getItem('usuario');
    if (!guardado) {
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(guardado);
    iniciarSesion(user);

    if (!user || user.rol !== 'admin') {
        const main = document.querySelector('.admin-main');
        if (main) {
            main.innerHTML = '<div class="panel card"><div class="panel-header"><h2>Acceso denegado</h2></div><div class="panel-content"><p>Necesitas ser administrador para usar esta sección.</p></div></div>';
        }
        return;
    }

    cargarAdminPage();
});

function cargarAdminPage() {
    Promise.all([
        fetchWithAuth(API + '/usuarios').then(res => res.ok ? res.json() : Promise.reject('Error cargando usuarios')),
        fetchWithAuth(API + '/grupos').then(res => res.ok ? res.json() : Promise.reject('Error cargando grupos')),
        fetchWithAuth(API + `/admin/logs`).then(res => res.ok ? res.json() : res.json().then(err => Promise.reject(err.error || 'Error cargando logs')))
    ])
    .then(([usuarios, grupos, logs]) => {
        renderAdminUsers(usuarios, grupos);
        renderAdminLogs(logs);
    })
    .catch(err => {
        mostrarMensaje('error', typeof err === 'string' ? err : err.message || 'Error cargando datos.');
    });
}

function renderAdminUsers(usuarios, grupos) {
    const cuerpo = document.querySelector('#adminUsersTable tbody');
    const totalUsers = document.getElementById('totalUsers');
    const totalAdmins = document.getElementById('totalAdmins');
    const totalGestores = document.getElementById('totalGestores');
    const totalDisabled = document.getElementById('totalDisabled');

    const grupoMap = grupos.reduce((map, grupo) => {
        map[grupo.id] = grupo.nombre;
        return map;
    }, {});

    const admins = usuarios.filter(u => u.rol === 'admin').length;
    const gestores = usuarios.filter(u => u.rol === 'gestor').length;
    const disabled = usuarios.filter(u => u.active === false).length;

    if (totalUsers) totalUsers.innerText = usuarios.length;
    if (totalAdmins) totalAdmins.innerText = admins;
    if (totalGestores) totalGestores.innerText = gestores;
    if (totalDisabled) totalDisabled.innerText = disabled;

    if (!cuerpo) return;
    cuerpo.innerHTML = '';

    usuarios.forEach(u => {
        const gruposNombres = (u.grupos || []).map(id => grupoMap[id] || `#${id}`).join(', ') || 'Ninguno';
        const roleButtons = [];
        if (u.rol !== 'admin') {
            roleButtons.push(`<button class="btn-role" onclick="cambiarRolAdmin(${u.id}, 'admin')">Hacer admin</button>`);
        }
        if (u.rol !== 'gestor') {
            roleButtons.push(`<button class="btn-role" onclick="cambiarRolAdmin(${u.id}, 'gestor')">Hacer gestor</button>`);
        }
        if (u.rol !== 'miembro') {
            roleButtons.push(`<button class="btn-role" onclick="cambiarRolAdmin(${u.id}, 'miembro')">Hacer miembro</button>`);
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${u.nombre}</td>
            <td>${u.rol}</td>
            <td><span class="user-status ${u.active ? 'label-active' : 'label-disabled'}">${u.active ? 'Activo' : 'Desactivado'}</span></td>
            <td>${gruposNombres}</td>
            <td>
                <div class="admin-actions">
                    ${roleButtons.join(' ')}
                    <button class="btn-toggle ${u.active ? '' : 'disabled'}" onclick="toggleEstadoAdmin(${u.id}, ${u.active ? 'false' : 'true'})">${u.active ? 'Desactivar' : 'Activar'}</button>
                </div>
            </td>
        `;
        cuerpo.appendChild(row);
    });
}

function renderAdminLogs(logs) {
    const container = document.getElementById('adminLogs');
    if (!container) return;

    if (!logs || logs.length === 0) {
        container.innerHTML = '<p>No hay logs recientes.</p>';
        return;
    }

    container.innerHTML = logs.map(log => {
        const actor = log.actor_id ? `Administrador #${log.actor_id}` : 'Sistema';
        const target = log.target ? `Target: ${log.target}` : '';
        return `
            <div class="log-entry">
                <strong>${new Date(log.timestamp).toLocaleString()}</strong>
                <span>${actor} — ${log.action}</span>
                <p>${target}</p>
                ${log.details ? `<small>${log.details}</small>` : ''}
            </div>
        `;
    }).join('');
}

function cambiarRolAdmin(usuarioId, nuevoRol) {
    fetchWithAuth(API + `/usuarios/${usuarioId}/cambiar-rol`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nuevo_rol: nuevoRol })
    })
    .then(res => res.ok ? res.json() : res.json().then(err => Promise.reject(err.error || 'Error')))
    .then(() => cargarAdminPage())
    .catch(err => mostrarMensaje('error', err));
}

function toggleEstadoAdmin(usuarioId, activo) {
    fetchWithAuth(API + `/usuarios/${usuarioId}/toggle-estado`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ activo })
    })
    .then(res => res.ok ? res.json() : res.json().then(err => Promise.reject(err.error || 'Error')))
    .then(() => cargarAdminPage())
    .catch(err => mostrarMensaje('error', err));
}