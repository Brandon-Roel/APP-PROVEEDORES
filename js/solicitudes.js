// Módulo de gestión de solicitudes
let solicitudes = [
    {
        id: 1,
        proveedor: "RUBEN MOISES MEJIA CRUZ",
        personaCompras: "Rosario",
        grupo: "008",
        fecha: "2024-01-15 14:30",
        tipo: "creacion",
        estado: "pendiente",
        rfc: "MECR9011276K0"
    },
    {
        id: 2,
        proveedor: "EMPRESAS EXAMPLE SA DE CV",
        personaCompras: "Carlos",
        grupo: "011",
        fecha: "2024-01-14 10:15",
        tipo: "actualizacion",
        estado: "proceso",
        rfc: "EES840101XXX"
    }
];

function initSolicitudes() {
    setupSolicitudesEventListeners();
}

function setupSolicitudesEventListeners() {
    // Botón crear solicitud (del modal)
    const btnCrearSolicitud = document.getElementById('btnCrearSolicitud');
    if (btnCrearSolicitud) {
        btnCrearSolicitud.addEventListener('click', function() {
            document.getElementById('modalCrearSolicitud').style.display = 'flex';
            limpiarFormularioCreacion();
        });
    }

    // Botón actualizar (del panel de solicitudes)
    const btnActualizar = document.getElementById('btnActualizar');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', cargarSolicitudes);
    }

    // Confirmar creación
    document.getElementById('btnConfirmarCrear').addEventListener('click', crearSolicitud);

    // Cerrar modales
    document.querySelectorAll('.close, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('modalDetalles').style.display = 'none';
            document.getElementById('modalCrearSolicitud').style.display = 'none';
        });
    });

    // Filtros en tiempo real
    document.getElementById('filterBusqueda').addEventListener('input', aplicarFiltros);
    document.getElementById('filterEstado').addEventListener('change', aplicarFiltros);
    document.getElementById('filterGrupo').addEventListener('change', aplicarFiltros);
}

function cargarSolicitudes() {
    const tbody = document.getElementById('tablaSolicitudes');
    if (!tbody) return;

    const solicitudesFiltradas = aplicarFiltros();
    
    if (solicitudesFiltradas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    No se encontraron solicitudes
                </td>
            </tr>
        `;
        const totalElement = document.getElementById('totalSolicitudes');
        if (totalElement) {
            totalElement.textContent = '0 solicitudes encontradas';
        }
        return;
    }

    tbody.innerHTML = solicitudesFiltradas.map(sol => `
        <tr>
            <td>
                <div class="proveedor-info">
                    <strong>${sol.proveedor}</strong>
                    <div class="text-sm text-muted">${sol.rfc}</div>
                </div>
            </td>
            <td>${sol.personaCompras}</td>
            <td>${sol.grupo}</td>
            <td>${sol.fecha}</td>
            <td>
                <span class="badge ${sol.tipo === 'creacion' ? 'badge-primary' : 'badge-info'}">
                    ${sol.tipo === 'creacion' ? 'Creación' : 'Actualización'}
                </span>
            </td>
            <td>
                <span class="status status-${sol.estado}">
                    ${obtenerTextoEstado(sol.estado)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="verDetalles(${sol.id})" title="Ver detalles">
                        👁️ Ver
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="modificarSolicitud(${sol.id})" title="Modificar">
                        ✏️ Modificar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarSolicitud(${sol.id})" title="Eliminar">
                        🗑️ Eliminar
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    const totalElement = document.getElementById('totalSolicitudes');
    if (totalElement) {
        totalElement.textContent = `${solicitudesFiltradas.length} solicitud(es) encontrada(s)`;
    }
}

function aplicarFiltros() {
    const filtroEstado = document.getElementById('filterEstado').value;
    const filtroGrupo = document.getElementById('filterGrupo').value;
    const filtroBusqueda = document.getElementById('filterBusqueda').value.toLowerCase();

    return solicitudes.filter(sol => {
        if (filtroEstado && sol.estado !== filtroEstado && sol.tipo !== filtroEstado) return false;
        if (filtroGrupo && sol.grupo !== filtroGrupo) return false;
        if (filtroBusqueda) {
            const textoBusqueda = `${sol.proveedor} ${sol.rfc} ${sol.personaCompras}`.toLowerCase();
            if (!textoBusqueda.includes(filtroBusqueda)) return false;
        }
        return true;
    });
}

function verDetalles(id) {
    const solicitud = solicitudes.find(s => s.id === id);
    if (solicitud) {
        document.getElementById('modalDetallesBody').innerHTML = `
            <div class="detalle-item">
                <label>Proveedor:</label>
                <span>${solicitud.proveedor}</span>
            </div>
            <div class="detalle-item">
                <label>RFC:</label>
                <span>${solicitud.rfc}</span>
            </div>
            <div class="detalle-item">
                <label>Persona Compras:</label>
                <span>${solicitud.personaCompras}</span>
            </div>
            <div class="detalle-item">
                <label>Grupo:</label>
                <span>${solicitud.grupo}</span>
            </div>
            <div class="detalle-item">
                <label>Tipo:</label>
                <span>${solicitud.tipo === 'creacion' ? 'Creación' : 'Actualización'}</span>
            </div>
            <div class="detalle-item">
                <label>Estado:</label>
                <span class="status status-${solicitud.estado}">${obtenerTextoEstado(solicitud.estado)}</span>
            </div>
            <div class="detalle-item">
                <label>Fecha:</label>
                <span>${solicitud.fecha}</span>
            </div>
        `;
        document.getElementById('modalDetalles').style.display = 'flex';
    }
}

function modificarSolicitud(id) {
    const solicitud = solicitudes.find(s => s.id === id);
    if (solicitud) {
        // Llenar formulario con datos existentes
        document.getElementById('inputProveedor').value = solicitud.proveedor;
        document.getElementById('inputRFC').value = solicitud.rfc;
        document.getElementById('selectTipo').value = solicitud.tipo;
        document.getElementById('selectEstado').value = solicitud.estado;
        document.getElementById('selectGrupo').value = solicitud.grupo;
        document.getElementById('inputPersonaCompras').value = solicitud.personaCompras;
        
        // Cambiar texto del botón
        document.getElementById('btnConfirmarCrear').textContent = 'Actualizar Solicitud';
        
        // Mostrar modal
        document.getElementById('modalCrearSolicitud').style.display = 'flex';
        
        // Guardar ID para actualización
        document.getElementById('btnConfirmarCrear').dataset.editingId = id;
    }
}

function eliminarSolicitud(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta solicitud?')) {
        solicitudes = solicitudes.filter(s => s.id !== id);
        cargarSolicitudes();
        mostrarNotificacion('Solicitud eliminada correctamente', 'success');
    }
}

function crearSolicitud() {
    const btnConfirmar = document.getElementById('btnConfirmarCrear');
    const isEditing = btnConfirmar.dataset.editingId;
    
    const proveedor = document.getElementById('inputProveedor').value.trim();
    const rfc = document.getElementById('inputRFC').value.trim();
    const tipo = document.getElementById('selectTipo').value;
    const estado = document.getElementById('selectEstado').value;
    const grupo = document.getElementById('selectGrupo').value;
    const personaCompras = document.getElementById('inputPersonaCompras').value.trim();

    if (!proveedor || !rfc || !tipo || !estado || !grupo) {
        mostrarNotificacion('Por favor completa todos los campos obligatorios', 'error');
        return;
    }

    if (isEditing) {
        // Actualizar solicitud existente
        const id = parseInt(isEditing);
        const index = solicitudes.findIndex(s => s.id === id);
        if (index !== -1) {
            solicitudes[index] = {
                ...solicitudes[index],
                proveedor: proveedor.toUpperCase(),
                rfc: rfc.toUpperCase(),
                tipo: tipo,
                estado: estado,
                grupo: grupo,
                personaCompras: personaCompras || 'No especificado',
                fecha: new Date().toLocaleString('es-MX')
            };
            mostrarNotificacion('Solicitud actualizada correctamente', 'success');
        }
        // Limpiar estado de edición
        delete btnConfirmar.dataset.editingId;
        btnConfirmar.textContent = 'Crear Solicitud';
    } else {
        // Crear nueva solicitud
        const nuevaSolicitud = {
            id: Math.max(...solicitudes.map(s => s.id)) + 1,
            proveedor: proveedor.toUpperCase(),
            rfc: rfc.toUpperCase(),
            tipo: tipo,
            estado: estado,
            grupo: grupo,
            personaCompras: personaCompras || 'No especificado',
            fecha: new Date().toLocaleString('es-MX')
        };

        solicitudes.unshift(nuevaSolicitud);
        mostrarNotificacion('Solicitud creada correctamente', 'success');
    }

    // Recargar la tabla si el panel de solicitudes está visible
    if (document.getElementById('solicitudesPanel').style.display !== 'none') {
        cargarSolicitudes();
    }
    
    document.getElementById('modalCrearSolicitud').style.display = 'none';
}

function limpiarFormularioCreacion() {
    document.getElementById('inputProveedor').value = '';
    document.getElementById('inputRFC').value = '';
    document.getElementById('selectTipo').value = '';
    document.getElementById('selectEstado').value = '';
    document.getElementById('selectGrupo').value = '';
    document.getElementById('inputPersonaCompras').value = '';
    
    // Asegurarse de que el botón esté en modo creación
    const btnConfirmar = document.getElementById('btnConfirmarCrear');
    btnConfirmar.textContent = 'Crear Solicitud';
    delete btnConfirmar.dataset.editingId;
}

function obtenerTextoEstado(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'proceso': 'En Proceso',
        'finalizada': 'Finalizada'
    };
    return estados[estado] || estado;
}