// Módulo de gestión para Proveedores
let solicitudesProveedor = [
    {
        id: 'PROV-2024-001',
        tipo: 'Alta de Proveedor',
        descripcion: 'Solicitud de alta como nuevo proveedor',
        fecha: '2024-01-15 14:30',
        estado: 'revision',
        prioridad: 'alta'
    },
    {
        id: 'PROV-2024-002', 
        tipo: 'Actualización de Datos',
        descripcion: 'Actualización de información bancaria',
        fecha: '2024-01-10 09:15',
        estado: 'aprobada',
        prioridad: 'media'
    }
];

// Funciones específicas para el formulario de alta
function setupFormAltaProveedor() {
    const form = document.getElementById('formAltaProveedor');
    const btnToggleRequisitos = document.getElementById('btnToggleRequisitos');
    const requisitosContent = document.getElementById('requisitosContent');
    const llevaRetencion = document.getElementById('llevaRetencion');
    const camposRetencion = document.getElementById('camposRetencion');
    const btnCancelarFormulario = document.getElementById('btnCancelarFormulario');

    // Toggle de requisitos
    if (btnToggleRequisitos && requisitosContent) {
        btnToggleRequisitos.addEventListener('click', () => {
            requisitosContent.classList.toggle('collapsed');
        });
    }

    // Mostrar/ocultar campos de retención
    if (llevaRetencion && camposRetencion) {
        llevaRetencion.addEventListener('change', function() {
            if (this.value === 'si') {
                camposRetencion.style.display = 'block';
                // Hacer requeridos los campos de retención
                document.getElementById('tipoRetencion').required = true;
                document.getElementById('indicadorRetencion').required = true;
            } else {
                camposRetencion.style.display = 'none';
                // Quitar requerido
                document.getElementById('tipoRetencion').required = false;
                document.getElementById('indicadorRetencion').required = false;
            }
        });
    }

    // Validación de caracteres especiales
    const inputsUppercase = document.querySelectorAll('.uppercase-input');
    inputsUppercase.forEach(input => {
        input.addEventListener('input', function(e) {
            // Convertir a mayúsculas
            this.value = this.value.toUpperCase();
            
            // Validar caracteres especiales
            const caracteresInvalidos = /[¡!\"'\(\)\*°\{\}\~\^Ñ,;:-]/;
            if (caracteresInvalidos.test(this.value)) {
                this.setCustomValidity('No se permiten caracteres especiales: ¡ ! " \' ( ) * ° { } ~ ^ Ñ , ; - :');
                this.style.borderColor = 'var(--color-error)';
            } else {
                this.setCustomValidity('');
                this.style.borderColor = '';
            }
        });
    });

    // Validación de RFC
    const rfcInput = document.getElementById('rfc');
    if (rfcInput) {
        rfcInput.addEventListener('blur', function() {
            if (!validarRFC(this.value)) {
                this.setCustomValidity('RFC inválido. Formato: 12 o 13 caracteres alfanuméricos');
                this.style.borderColor = 'var(--color-error)';
            } else {
                this.setCustomValidity('');
                this.style.borderColor = '';
            }
        });
    }

    // Validación de CLABE
    const clabeInput = document.getElementById('cuentaClabe');
    if (clabeInput) {
        clabeInput.addEventListener('blur', function() {
            if (!validarCLABE(this.value)) {
                this.setCustomValidity('CLABE inválida. Debe tener 18 dígitos');
                this.style.borderColor = 'var(--color-error)';
            } else {
                this.setCustomValidity('');
                this.style.borderColor = '';
            }
        });
    }

    // Envío del formulario
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            enviarSolicitudAlta();
        });
    }

    // Botón cancelar
    if (btnCancelarFormulario) {
        btnCancelarFormulario.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres cancelar? Se perderán los datos no guardados.')) {
                form.reset();
                document.getElementById('uploadedFiles').innerHTML = '';
                camposRetencion.style.display = 'none';
            }
        });
    }
}

function validarRFC(rfc) {
    const regex = /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/;
    return regex.test(rfc);
}

function validarCLABE(clabe) {
    const regex = /^[0-9]{18}$/;
    return regex.test(clabe);
}

function enviarSolicitudAlta() {
    const form = document.getElementById('formAltaProveedor');
    const uploadedFiles = document.getElementById('uploadedFiles');
    
    // Validar que se hayan subido archivos
    if (uploadedFiles.children.length === 0) {
        mostrarNotificacion('Debe subir al menos un documento', 'error');
        return;
    }

    // Validar tipo de persona y documentos requeridos
    const tipoRFC = document.getElementById('tipoRFC').value;
    if (!validarDocumentosRequeridos(tipoRFC)) {
        mostrarNotificacion('Faltan documentos requeridos para el tipo de persona seleccionado', 'error');
        return;
    }

    // Simular envío (en producción aquí iría la llamada a la API)
    mostrarNotificacion('Solicitud de alta enviada correctamente. Será revisada por el departamento correspondiente.', 'success');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('uploadedFiles').innerHTML = '';
    document.getElementById('camposRetencion').style.display = 'none';
    
    // Regresar al inicio después de 2 segundos
    setTimeout(() => {
        appProveedores.showPanel('inicio');
        appProveedores.updateSidebarActive('inicio');
    }, 2000);
}

function validarDocumentosRequeridos(tipoPersona) {
    // En una implementación real, aquí se validarían los archivos subidos
    // contra los documentos requeridos según el tipo de persona
    const uploadedFiles = document.getElementById('uploadedFiles');
    
    if (uploadedFiles.children.length === 0) {
        return false;
    }
    
    // Simulación de validación básica
    return true;
}

function initProveedores() {
    setupProveedoresEventListeners();
    setupFormAltaProveedor();
}

function setupProveedoresEventListeners() {
    // Filtros en tiempo real para status
    document.getElementById('filterStatus').addEventListener('change', cargarSolicitudesProveedor);
    document.getElementById('filterFecha').addEventListener('change', cargarSolicitudesProveedor);
    document.getElementById('filterBusquedaSolicitud').addEventListener('input', cargarSolicitudesProveedor);
}

function cargarSolicitudesProveedor() {
    const tbody = document.getElementById('tablaSolicitudesProveedor');
    if (!tbody) return;

    const solicitudesFiltradas = aplicarFiltrosProveedor();
    
    if (solicitudesFiltradas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    No se encontraron solicitudes
                </td>
            </tr>
        `;
        const totalElement = document.getElementById('totalSolicitudesProveedor');
        if (totalElement) {
            totalElement.textContent = '0 solicitudes encontradas';
        }
        return;
    }

    tbody.innerHTML = solicitudesFiltradas.map(sol => `
        <tr>
            <td>
                <strong>${sol.id}</strong>
            </td>
            <td>${sol.tipo}</td>
            <td>
                <div class="text-sm">${sol.descripcion}</div>
            </td>
            <td>${sol.fecha}</td>
            <td>
                <span class="status status-${sol.estado}">
                    ${obtenerTextoEstadoProveedor(sol.estado)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="verDetallesSolicitud('${sol.id}')" title="Ver detalles">
                        👁️ Ver
                    </button>
                    <button class="btn btn-info btn-sm" onclick="seguirSolicitud('${sol.id}')" title="Seguimiento">
                        📋 Seguir
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    const totalElement = document.getElementById('totalSolicitudesProveedor');
    if (totalElement) {
        totalElement.textContent = `${solicitudesFiltradas.length} solicitud(es) encontrada(s)`;
    }
}

function aplicarFiltrosProveedor() {
    const filtroEstado = document.getElementById('filterStatus').value;
    const filtroFecha = document.getElementById('filterFecha').value;
    const filtroBusqueda = document.getElementById('filterBusquedaSolicitud').value.toLowerCase();

    return solicitudesProveedor.filter(sol => {
        if (filtroEstado && sol.estado !== filtroEstado) return false;
        if (filtroFecha) {
            const fechaSolicitud = sol.fecha.split(' ')[0];
            if (fechaSolicitud !== filtroFecha) return false;
        }
        if (filtroBusqueda) {
            const textoBusqueda = `${sol.id} ${sol.tipo} ${sol.descripcion}`.toLowerCase();
            if (!textoBusqueda.includes(filtroBusqueda)) return false;
        }
        return true;
    });
}

function verDetallesSolicitud(id) {
    const solicitud = solicitudesProveedor.find(s => s.id === id);
    if (solicitud) {
        document.getElementById('modalDetallesSolicitudBody').innerHTML = `
            <div class="detalle-item">
                <label>ID Solicitud:</label>
                <span><strong>${solicitud.id}</strong></span>
            </div>
            <div class="detalle-item">
                <label>Tipo:</label>
                <span>${solicitud.tipo}</span>
            </div>
            <div class="detalle-item">
                <label>Descripción:</label>
                <span>${solicitud.descripcion}</span>
            </div>
            <div class="detalle-item">
                <label>Prioridad:</label>
                <span>${solicitud.prioridad === 'alta' ? 'Alta' : solicitud.prioridad === 'media' ? 'Media' : 'Baja'}</span>
            </div>
            <div class="detalle-item">
                <label>Estado:</label>
                <span class="status status-${solicitud.estado}">${obtenerTextoEstadoProveedor(solicitud.estado)}</span>
            </div>
            <div class="detalle-item">
                <label>Fecha de Envío:</label>
                <span>${solicitud.fecha}</span>
            </div>
            <div class="detalle-section">
                <h5>Historial de Seguimiento</h5>
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-date">${solicitud.fecha}</div>
                        <div class="timeline-content">
                            <strong>Solicitud enviada</strong>
                            <p>Solicitud creada y enviada para revisión</p>
                        </div>
                    </div>
                    ${solicitud.estado !== 'pendiente' ? `
                    <div class="timeline-item">
                        <div class="timeline-date">2024-01-16 10:00</div>
                        <div class="timeline-content">
                            <strong>En revisión</strong>
                            <p>La solicitud está siendo revisada por el departamento correspondiente</p>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        document.getElementById('modalDetallesSolicitud').style.display = 'flex';
    }
}

function seguirSolicitud(id) {
    mostrarNotificacion(`Seguimiento de solicitud ${id} - Esta funcionalidad estará disponible próximamente`, 'info');
}

function obtenerTextoEstadoProveedor(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'revision': 'En Revisión',
        'aprobada': 'Aprobada',
        'rechazada': 'Rechazada',
        'completada': 'Completada'
    };
    return estados[estado] || estado;
}

// Inicializar módulo cuando esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProveedores);
} else {
    initProveedores();
}