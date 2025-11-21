// Configuración de la aplicación para Proveedores
class AppProveedores {
    constructor() {
        this.userName = 'Proveedor';
        this.currentPanel = 'inicio';
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 Aplicación de Proveedores inicializada');
            this.showWelcomeScreen();
            this.setupEventListeners();
        });
    }

    showWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        const welcomeMessage = document.getElementById('welcomeMessage');
        const mainApp = document.getElementById('mainApp');
        const personalWelcomeTitle = document.getElementById('personalWelcomeTitle');

        // Personalizar mensaje de bienvenida
        welcomeMessage.textContent = `Bienvenido ${this.userName}`;
        personalWelcomeTitle.textContent = `¡Bienvenido ${this.userName}!`;

        // Mostrar pantalla de bienvenida por 3 segundos
        setTimeout(() => {
            welcomeScreen.style.opacity = '0';
            welcomeScreen.style.transition = 'opacity 0.5s ease-in-out';

            setTimeout(() => {
                welcomeScreen.style.display = 'none';
                mainApp.style.display = 'block';
                
                // Inicializar módulos después de mostrar la app
                this.initializeModules();
            }, 500);
        }, 3000);
    }

    setupEventListeners() {
        // Navegación del sidebar
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleNavigation(e);
            });
        });

        // Cerrar modales
        document.querySelectorAll('.close, .btn-secondary').forEach(btn => {
            btn.addEventListener('click', function() {
                document.getElementById('modalDetallesSolicitud').style.display = 'none';
            });
        });

        // Tecla Escape para cerrar modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });
    }

    handleNavigation(e) {
        const target = e.currentTarget;
        const tab = target.dataset.tab;

        // Remover clase active de todos los items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Agregar clase active al item clickeado
        target.classList.add('active');

        // Manejar cambio de vistas según la pestaña seleccionada
        console.log(`Navegando a: ${tab}`);
        this.showPanel(tab);
    }

    setupMainNavigation() {
        // Botones del panel principal
        document.getElementById('btnCrearSolicitudMain').addEventListener('click', () => {
            this.showPanel('crear-solicitud');
            this.updateSidebarActive('crear-solicitud');
        });

        document.getElementById('btnVisualizarStatusMain').addEventListener('click', () => {
            this.showPanel('visualizar-status');
            this.updateSidebarActive('visualizar-status');
        });

        document.getElementById('btnActualizarDatosMain').addEventListener('click', () => {
            this.showPanel('actualizar-datos');
            this.updateSidebarActive('actualizar-datos');
        });

        // Botones Volver al Inicio
        document.getElementById('btnVolverInicioCrear').addEventListener('click', () => {
            this.showPanel('inicio');
            this.updateSidebarActive('inicio');
        });

        document.getElementById('btnVolverInicioStatus').addEventListener('click', () => {
            this.showPanel('inicio');
            this.updateSidebarActive('inicio');
        });

        document.getElementById('btnVolverInicioActualizar').addEventListener('click', () => {
            this.showPanel('inicio');
            this.updateSidebarActive('inicio');
        });

        document.getElementById('btnVolverInicioConfiguracion').addEventListener('click', () => {
            this.showPanel('inicio');
            this.updateSidebarActive('inicio');
        });

        // Configurar subida de archivos
        this.setupFileUpload();
    }

    showPanel(panelName) {
        // Ocultar todos los paneles
        document.getElementById('mainActionsPanel').style.display = 'none';
        document.getElementById('crearSolicitudPanel').style.display = 'none';
        document.getElementById('visualizarStatusPanel').style.display = 'none';
        document.getElementById('actualizarDatosPanel').style.display = 'none';
        document.getElementById('configuracionPanel').style.display = 'none';

        // Mostrar el panel seleccionado
        switch (panelName) {
            case 'inicio':
                document.getElementById('mainActionsPanel').style.display = 'block';
                break;
            case 'crear-solicitud':
                document.getElementById('crearSolicitudPanel').style.display = 'block';
                break;
            case 'visualizar-status':
                document.getElementById('visualizarStatusPanel').style.display = 'block';
                // Cargar solicitudes del proveedor
                if (typeof cargarSolicitudesProveedor === 'function') {
                    cargarSolicitudesProveedor();
                }
                break;
            case 'actualizar-datos':
                document.getElementById('actualizarDatosPanel').style.display = 'block';
                break;
            case 'configuracion':
                document.getElementById('configuracionPanel').style.display = 'block';
                break;
        }

        this.currentPanel = panelName;
    }

    updateSidebarActive(panelName) {
        // Remover clase active de todos los items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Agregar clase active al item correspondiente
        const activeItem = document.querySelector(`.nav-item[data-tab="${panelName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    setupFileUpload() {
        const fileUploadArea = document.querySelector('.file-upload-area');
        const fileInput = document.getElementById('fileUpload');
        const uploadedFiles = document.getElementById('uploadedFiles');

        if (fileUploadArea && fileInput) {
            // Click en el área de upload
            fileUploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            // Cambio en el input de archivos
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelection(e.target.files);
            });

            // Drag and drop
            fileUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUploadArea.classList.add('drag-over');
            });

            fileUploadArea.addEventListener('dragleave', () => {
                fileUploadArea.classList.remove('drag-over');
            });

            fileUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUploadArea.classList.remove('drag-over');
                this.handleFileSelection(e.dataTransfer.files);
            });
        }
    }

    handleFileSelection(files) {
        const uploadedFiles = document.getElementById('uploadedFiles');
        
        if (files.length > 0) {
            uploadedFiles.innerHTML = '';
            
            Array.from(files).forEach(file => {
                // Validar tamaño máximo (10MB)
                const maxSize = 10 * 1024 * 1024; // 10MB en bytes
                if (file.size > maxSize) {
                    mostrarNotificacion(`El archivo ${file.name} excede el tamaño máximo de 10MB`, 'error');
                    return;
                }

                // Validar tipo de archivo
                const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                if (!allowedTypes.includes(file.type)) {
                    mostrarNotificacion(`El archivo ${file.name} no es un formato permitido (PDF, JPG, PNG)`, 'error');
                    return;
                }

                const fileElement = document.createElement('div');
                fileElement.className = 'uploaded-file';
                fileElement.innerHTML = `
                    <div class="file-info">
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">(${this.formatFileSize(file.size)})</span>
                    </div>
                    <div class="file-actions">
                        <button class="btn btn-danger btn-sm" onclick="this.parentElement.parentElement.remove()">
                            🗑️
                        </button>
                    </div>
                `;
                uploadedFiles.appendChild(fileElement);
            });
            
            mostrarNotificacion(`${files.length} archivo(s) subido(s) correctamente`, 'success');
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    initializeModules() {
        // Configurar navegación principal
        this.setupMainNavigation();

        // Mostrar panel principal por defecto
        this.showPanel('inicio');
        this.updateSidebarActive('inicio');
    }
}

// Inicializar la aplicación de proveedores
const appProveedores = new AppProveedores();