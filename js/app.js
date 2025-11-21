// Configuración de la aplicación
class App {
    constructor() {
        this.userName = 'Administrador Sistema';
        this.currentPanel = 'inicio'; // Panel actual
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
            // Animación de salida
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

        // Cerrar modales al hacer clic fuera
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
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
        // Botón Ver Solicitudes (del panel principal)
        document.getElementById('btnVerSolicitudes').addEventListener('click', () => {
            this.showPanel('solicitudes');
            // Actualizar sidebar
            this.updateSidebarActive('solicitudes');
        });

        // Botones Volver al Inicio
        document.getElementById('btnVolverInicio').addEventListener('click', () => {
            this.showPanel('inicio');
            this.updateSidebarActive('inicio');
        });

        document.getElementById('btnVolverInicioProveedores').addEventListener('click', () => {
            this.showPanel('inicio');
            this.updateSidebarActive('inicio');
        });

        document.getElementById('btnVolverInicioConfiguracion').addEventListener('click', () => {
            this.showPanel('inicio');
            this.updateSidebarActive('inicio');
        });

        // Botones del panel principal
        document.getElementById('btnCrearSolicitudMain').addEventListener('click', () => {
            document.getElementById('modalCrearSolicitud').style.display = 'flex';
            if (typeof limpiarFormularioCreacion === 'function') {
                limpiarFormularioCreacion();
            }
        });

        document.getElementById('btnActualizarMain').addEventListener('click', () => {
            if (typeof cargarSolicitudes === 'function') {
                cargarSolicitudes();
            }
            mostrarNotificacion('Lista actualizada correctamente', 'success');
        });
    }

    showPanel(panelName) {
        // Ocultar todos los paneles
        document.getElementById('mainActionsPanel').style.display = 'none';
        document.getElementById('solicitudesPanel').style.display = 'none';
        document.getElementById('proveedoresPanel').style.display = 'none';
        document.getElementById('configuracionPanel').style.display = 'none';

        // Mostrar el panel seleccionado
        switch (panelName) {
            case 'inicio':
                document.getElementById('mainActionsPanel').style.display = 'block';
                break;
            case 'solicitudes':
                document.getElementById('solicitudesPanel').style.display = 'block';
                // Cargar las solicitudes cuando se muestra el panel
                if (typeof cargarSolicitudes === 'function') {
                    cargarSolicitudes();
                }
                break;
            case 'proveedores':
                document.getElementById('proveedoresPanel').style.display = 'block';
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

    initializeModules() {
        // Inicializar módulo de solicitudes
        if (typeof initSolicitudes === 'function') {
            initSolicitudes();
        }

        // Configurar navegación principal
        this.setupMainNavigation();

        // Mostrar panel principal por defecto
        this.showPanel('inicio');
        this.updateSidebarActive('inicio');
    }
}

// Inicializar la aplicación
const app = new App();