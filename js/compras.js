// Módulo de gestión para Compras
let solicitudesCompras = [
    {
        id: 'COMP-2024-001',
        proveedor: 'EMPRESAS EXAMPLE SA DE CV',
        rfc: 'EES840101XXX',
        tipo: 'moral',
        fecha: '2024-01-15 14:30',
        estado: 'pendiente',
        documentos: 5,
        contactoCompras: '008'
    },
    {
        id: 'COMP-2024-002',
        proveedor: 'RUBEN MOISES MEJIA CRUZ',
        rfc: 'MECR9011276K0',
        tipo: 'fisica',
        fecha: '2024-01-14 10:15',
        estado: 'revision',
        documentos: 4,
        contactoCompras: '005'
    },
    {
        id: 'COMP-2024-003',
        proveedor: 'PROVEEDOR VALIDADO SA DE CV',
        rfc: 'PVS800101XXX',
        tipo: 'moral',
        fecha: '2024-01-10 09:00',
        estado: 'validado',
        documentos: 6,
        contactoCompras: '011'
    }
];

// Funciones específicas para el formulario de alta (reutilizado de proveedores)
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
                document.getElementById('tipoRetencion').required = true;
                document.getElementById('indicadorRetencion').required = true;
            } else {
                camposRetencion.style.display = 'none';
                document.getElementById('tipoRetencion').required = false;
                document.getElementById('indicadorRetencion').required = false;
            }
        });
    }

    // Validación de caracteres especiales
    const inputsUppercase = document.querySelectorAll('.uppercase-input');
    inputsUppercase.forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = this.value.toUpperCase();
            
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
            enviarSolicitudAltaCompras();
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

function validarCLABE(clabe) {
    const regex = /^[0-9]{18}$/;
    return regex.test(clabe);
}

function enviarSolicitudAltaCompras() {
    const form = document.getElementById('formAltaProveedor');
    const uploadedFiles = document.getElementById('uploadedFiles');
    
    // Validar que se hayan subido archivos
    if (uploadedFiles.children.length === 0) {
        mostrarNotificacion('Debe subir al menos un documento', 'error');
        return;
    }

    // Simular envío
    mostrarNotificacion('Solicitud de alta creada correctamente. Ahora puede revisarla en "Visualizar Solicitudes"', 'success');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('uploadedFiles').innerHTML = '';
    document.getElementById('camposRetencion').style.display = 'none';
    
    // Regresar al inicio después de 2 segundos
    setTimeout(() => {
        appCompras.showPanel('inicio');
        appCompras.updateSidebarActive('inicio');
    }, 2000);
}

function initCompras() {
    setupComprasEventListeners();
    setupFormAltaProveedor();
}

function setupComprasEventListeners() {
    // Filtros en tiempo real para compras
    document.getElementById('filterEstadoCompras').addEventListener('change', cargarSolicitudesCompras);
    document.getElementById('filterTipoCompras').addEventListener('change', cargarSolicitudesCompras);
    document.getElementById('filterBusquedaCompras').addEventListener('input', cargarSolicitudesCompras);

    // Botones de acción en modal
    document.getElementById('btnValidarSolicitud').addEventListener('click', validarSolicitud);
    document.getElementById('btnConfirmarRechazo').addEventListener('click', confirmarRechazo);
    document.getElementById('btnCancelarRechazo').addEventListener('click', () => {
        document.getElementById('modalRechazarSolicitud').style.display = 'none';
    });
}

function cargarSolicitudesCompras() {
    const tbody = document.getElementById('tablaSolicitudesCompras');
    if (!tbody) return;

    const solicitudesFiltradas = aplicarFiltrosCompras();
    
    if (solicitudesFiltradas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    No se encontraron solicitudes
                </td>
            </tr>
        `;
        const totalElement = document.getElementById('totalSolicitudesCompras');
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
                    <div class="text-sm text-muted">Grupo: ${sol.contactoCompras}</div>
                </div>
            </td>
            <td>${sol.rfc}</td>
            <td>
                <span class="badge ${sol.tipo === 'fisica' ? 'badge-info' : 'badge-primary'}">
                    ${sol.tipo === 'fisica' ? 'Persona Física' : 'Persona Moral'}
                </span>
            </td>
            <td>${sol.fecha}</td>
            <td>
                <span class="status status-${sol.estado}">
                    ${obtenerTextoEstadoCompras(sol.estado)}
                </span>
            </td>
            <td>
                <span class="badge ${sol.documentos >= 5 ? 'badge-success' : 'badge-warning'}">
                    ${sol.documentos} doc(s)
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="verDetallesSolicitudCompras('${sol.id}')" title="Ver detalles">
                        👁️ Ver
                    </button>
                    ${sol.estado === 'pendiente' || sol.estado === 'revision' ? `
                    <button class="btn btn-success btn-sm" onclick="validarSolicitud('${sol.id}')" title="Validar">
                        ✅ Validar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="rechazarSolicitud('${sol.id}')" title="Rechazar">
                        ❌ Rechazar
                    </button>
                    ` : ''}
                    ${sol.estado === 'validado' ? `
                    <button class="btn btn-warning btn-sm" onclick="enviarADatosMaestros('${sol.id}')" title="Enviar a Datos Maestros">
                        📤 Enviar
                    </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');

    const totalElement = document.getElementById('totalSolicitudesCompras');
    if (totalElement) {
        totalElement.textContent = `${solicitudesFiltradas.length} solicitud(es) encontrada(s)`;
    }
}

function aplicarFiltrosCompras() {
    const filtroEstado = document.getElementById('filterEstadoCompras').value;
    const filtroTipo = document.getElementById('filterTipoCompras').value;
    const filtroBusqueda = document.getElementById('filterBusquedaCompras').value.toLowerCase();

    return solicitudesCompras.filter(sol => {
        if (filtroEstado && sol.estado !== filtroEstado) return false;
        if (filtroTipo && sol.tipo !== filtroTipo) return false;
        if (filtroBusqueda) {
            const textoBusqueda = `${sol.proveedor} ${sol.rfc} ${sol.id}`.toLowerCase();
            if (!textoBusqueda.includes(filtroBusqueda)) return false;
        }
        return true;
    });
}

function verDetallesSolicitudCompras(id) {
    const solicitud = solicitudesCompras.find(s => s.id === id);
    if (solicitud) {
        document.getElementById('modalDetallesSolicitudBody').innerHTML = `
            <div class="detalle-grid">
                <div class="detalle-col">
                    <div class="detalle-item">
                        <label>ID Solicitud:</label>
                        <span><strong>${solicitud.id}</strong></span>
                    </div>
                    <div class="detalle-item">
                        <label>Proveedor:</label>
                        <span>${solicitud.proveedor}</span>
                    </div>
                    <div class="detalle-item">
                        <label>RFC:</label>
                        <span>${solicitud.rfc}</span>
                    </div>
                    <div class="detalle-item">
                        <label>Tipo:</label>
                        <span>${solicitud.tipo === 'fisica' ? 'Persona Física' : 'Persona Moral'}</span>
                    </div>
                </div>
                <div class="detalle-col">
                    <div class="detalle-item">
                        <label>Grupo Compras:</label>
                        <span>${solicitud.contactoCompras}</span>
                    </div>
                    <div class="detalle-item">
                        <label>Fecha Solicitud:</label>
                        <span>${solicitud.fecha}</span>
                    </div>
                    <div class="detalle-item">
                        <label>Estado:</label>
                        <span class="status status-${solicitud.estado}">${obtenerTextoEstadoCompras(solicitud.estado)}</span>
                    </div>
                    <div class="detalle-item">
                        <label>Documentos:</label>
                        <span>${solicitud.documentos} documento(s)</span>
                    </div>
                </div>
            </div>
            
            <div class="detalle-section">
                <h5>📄 Documentos Adjuntos</h5>
                <div class="documentos-lista">
                    <div class="documento-item">
                        <span>📋 Constancia de Situación Fiscal</span>
                        <span class="status status-validado">✅ Revisado</span>
                    </div>
                    <div class="documento-item">
                        <span>🏠 Comprobante de Domicilio</span>
                        <span class="status status-validado">✅ Revisado</span>
                    </div>
                    <div class="documento-item">
                        <span>🏦 Estado de Cuenta Bancario</span>
                        <span class="status status-pendiente">⏳ Pendiente</span>
                    </div>
                    <div class="documento-item">
                        <span>🆔 Identificación Oficial</span>
                        <span class="status status-validado">✅ Revisado</span>
                    </div>
                    ${solicitud.tipo === 'moral' ? `
                    <div class="documento-item">
                        <span>📜 Acta Constitutiva</span>
                        <span class="status status-validado">✅ Revisado</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="detalle-section">
                <h5>📝 Comentarios de Validación</h5>
                <div class="comentarios-area">
                    <textarea class="form-control" placeholder="Agregar comentarios sobre la validación..." rows="3"></textarea>
                </div>
            </div>
        `;
        
        // Mostrar/ocultar botón de validar según estado
        const btnValidar = document.getElementById('btnValidarSolicitud');
        if (solicitud.estado === 'validado' || solicitud.estado === 'enviado-dm') {
            btnValidar.style.display = 'none';
        } else {
            btnValidar.style.display = 'inline-block';
            btnValidar.onclick = () => validarSolicitud(id);
        }
        
        document.getElementById('modalDetallesSolicitud').style.display = 'flex';
    }
}

function validarSolicitud(id) {
    const solicitud = solicitudesCompras.find(s => s.id === id);
    if (solicitud) {
        solicitud.estado = 'validado';
        cargarSolicitudesCompras();
        document.getElementById('modalDetallesSolicitud').style.display = 'none';
        mostrarNotificacion(`Solicitud ${id} validada correctamente. Ahora puede enviarla a Datos Maestros.`, 'success');
    }
}

function rechazarSolicitud(id) {
    const solicitud = solicitudesCompras.find(s => s.id === id);
    if (solicitud) {
        // Guardar ID para usar en la confirmación
        document.getElementById('btnConfirmarRechazo').dataset.solicitudId = id;
        document.getElementById('modalRechazarSolicitud').style.display = 'flex';
    }
}

function confirmarRechazo() {
    const id = document.getElementById('btnConfirmarRechazo').dataset.solicitudId;
    const motivo = document.getElementById('motivoRechazo').value;
    
    if (!motivo.trim()) {
        mostrarNotificacion('Debe especificar el motivo del rechazo', 'error');
        return;
    }

    const solicitud = solicitudesCompras.find(s => s.id === id);
    if (solicitud) {
        solicitud.estado = 'rechazado';
        solicitud.motivoRechazo = motivo;
        cargarSolicitudesCompras();
        document.getElementById('modalRechazarSolicitud').style.display = 'none';
        document.getElementById('motivoRechazo').value = '';
        mostrarNotificacion(`Solicitud ${id} rechazada correctamente.`, 'success');
    }
}

function enviarADatosMaestros(id) {
    const solicitud = solicitudesCompras.find(s => s.id === id);
    if (solicitud) {
        solicitud.estado = 'enviado-dm';
        cargarSolicitudesCompras();
        mostrarNotificacion(`Solicitud ${id} enviada a Datos Maestros correctamente.`, 'success');
    }
}

function obtenerTextoEstadoCompras(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'revision': 'En Revisión',
        'validado': 'Validado',
        'rechazado': 'Rechazado',
        'enviado-dm': 'Enviado a DM'
    };
    return estados[estado] || estado;
}

// Inicializar módulo cuando esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompras);
} else {
    initCompras();
}