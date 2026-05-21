// -------- DROPDOWN --------

function toggleDropdown() {
    const dropdown = document.getElementById("dropdown");
    if (!dropdown) return;
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', function(event) {
    const profilePic = document.getElementById('profilePic');
    const dropdown = document.getElementById('dropdown');
    if (profilePic && dropdown && !profilePic.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

// -------- TEMA OSCURO --------

function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const toggleBtn = document.querySelector('.theme-toggle');
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
}

// Cargar tema al inicio
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) toggleBtn.textContent = '☀️';
    }
});

// -------- NAVEGACIÓN --------

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
}

function showSection(event, link, sectionId) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }

    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Mostrar la sección seleccionada
    const targetSection = document.getElementById('section-' + sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Actualizar menú activo
    const links = document.querySelectorAll('.sidebar a');
    links.forEach(linkEl => linkEl.classList.remove('active'));
    if (link && link.classList) {
        link.classList.add('active');
    }

    // Cerrar sidebar en mobile
    const sidebar = document.getElementById('sidebar');
    if (window.matchMedia('(max-width: 768px)').matches && sidebar) {
        sidebar.classList.remove('show');
    }
}

// -------- DASHBOARD SUMMARY --------

function cargarDashboardResumen() {
    const grupoId = document.getElementById("selectGrupo").value;
    if (!grupoId) {
        document.getElementById("dashboardInfo").innerText = "Selecciona un grupo para ver estadísticas.";
        return;
    }

    fetchWithAuth(API + `/grupos/${grupoId}/dashboard`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error); });
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("dashboardInfo").innerHTML = `
                <div><b>Miembros:</b> ${data.total_miembros}</div>
                <div><b>Entrenamientos:</b> ${data.total_entrenamientos}</div>
                <div><b>Asistencias registradas:</b> ${data.total_asistencias}</div>
                <div><b>Próximos entrenamientos:</b></div>
                <ul>${data.proximos_entrenamientos.map(e => `<li>${e.fecha} ${e.hora} - ${e.tipo} (${e.ubicacion || 'Sin ubicación'})</li>`).join("")}</ul>
            `;
        })
        .catch(err => {
            document.getElementById("dashboardInfo").innerText = err.message;
        });
}