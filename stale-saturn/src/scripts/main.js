// Funcionalidades JavaScript para Peeps

document.addEventListener('DOMContentLoaded', function() {
    initializePeepsApp();
    setupFormValidations();
    setupCardHoverEffects();
    setupMobileMenu();
});

function initializePeepsApp() {
    setupSidebarNavigation();
}
function setupSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            const section = this.querySelector('span').textContent;
            showNotification(`Navegando a ${section}`, 'info');
        });
    });
}

function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.card-custom');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function setupFormValidations() {
    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        const inputs = registroForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateRegistroField(this);
            });
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateRegistroField(this);
                }
            });
        });
    }
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const inputs = loginForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateLoginField(this);
            });
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateLoginField(this);
                }
            });
        });
    }
}
function validateRegistroField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    switch (field.id) {
        case 'nombreRegistro':
            if (value.length < 2) {
                field.classList.add('is-invalid');
                isValid = false;
                showFieldError(field, 'El nombre debe tener al menos 2 caracteres');
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
                hideFieldError(field);
            }
            break;
            
        case 'emailRegistro':
            if (!isValidEmail(value)) {
                field.classList.add('is-invalid');
                isValid = false;
                showFieldError(field, 'Por favor ingresa un correo electrónico válido');
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
                hideFieldError(field);
            }
            break;
            
        case 'passwordRegistro':
            if (value.length < 6) {
                field.classList.add('is-invalid');
                isValid = false;
                showFieldError(field, 'La contraseña debe tener al menos 6 caracteres');
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
                hideFieldError(field);
                const confirmPassword = document.getElementById('confirmPasswordRegistro');
                if (confirmPassword.value) {
                    validateRegistroField(confirmPassword);
                }
            }
            break;
            
        case 'confirmPasswordRegistro':
            const password = document.getElementById('passwordRegistro').value;
            if (value !== password) {
                field.classList.add('is-invalid');
                isValid = false;
                showFieldError(field, 'Las contraseñas no coinciden');
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
                hideFieldError(field);
            }
            break;
            
        case 'terminosRegistro':
            if (!field.checked) {
                field.classList.add('is-invalid');
                isValid = false;
                showFieldError(field, 'Debes aceptar los términos y condiciones');
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
                hideFieldError(field);
            }
            break;
    }
    
    return isValid;
}

// Función para validar campos del formulario de login
function validateLoginField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    switch (field.id) {
        case 'emailLogin':
            if (!isValidEmail(value)) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
            break;
            
        case 'passwordLogin':
            if (value.length < 1) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
            break;
    }
    
    return isValid;
}

function handleRegistroSubmit() {
    const form = document.getElementById('registroForm');
    const fields = form.querySelectorAll('input');
    let isValid = true;
    fields.forEach(field => {
        if (!validateRegistroField(field)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        const formData = {
            nombre: document.getElementById('nombreRegistro').value,
            email: document.getElementById('emailRegistro').value,
            password: document.getElementById('passwordRegistro').value
        };
        
        
        showNotification('👥 ¡Registro exitoso! Bienvenido a Peeps', 'success');

        const modal = bootstrap.Modal.getInstance(document.getElementById('registroModal'));
        modal.hide();
        
        // Limpiar formulario
        form.reset();
        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
    } else {
        showNotification('Por favor completa todos los campos correctamente', 'warning');
    }
}

// Función para manejar el envío del formulario de login
function handleLoginSubmit() {
    const form = document.getElementById('loginForm');
    const fields = form.querySelectorAll('input[required]');
    let isValid = true;
    
    // Validar campos requeridos
    fields.forEach(field => {
        if (!validateLoginField(field)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        // Simular envío del formulario
        const formData = {
            email: document.getElementById('emailLogin').value,
            password: document.getElementById('passwordLogin').value,
            recordar: document.getElementById('recordarLogin').checked
        };
        
        
        // Mostrar mensaje de éxito
        showNotification('👥 ¡Inicio de sesión exitoso!', 'success');
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        
        // Limpiar formulario
        form.reset();
        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
    } else {
        showNotification('Por favor ingresa tus credenciales correctamente', 'warning');
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 4000);
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para mostrar error de campo específico
function showFieldError(field, message) {
    // Remover error anterior si existe
    hideFieldError(field);
    
    // Crear elemento de error
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(220, 53, 69, 0.95);
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
        font-size: 0.85rem;
        margin-top: 0.25rem;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideInDown 0.3s ease-out;
    `;
    
    // Agregar al contenedor del campo
    const fieldContainer = field.closest('.mb-3');
    if (fieldContainer) {
        fieldContainer.style.position = 'relative';
        fieldContainer.appendChild(errorElement);
    }
}

// Función para ocultar error de campo
function hideFieldError(field) {
    const fieldContainer = field.closest('.mb-3');
    if (fieldContainer) {
        const existingError = fieldContainer.querySelector('.field-error-message');
        if (existingError) {
            existingError.remove();
        }
    }
}

// Función para mostrar modal de Términos y Condiciones
function showTerminosModal() {
    const modal = new bootstrap.Modal(document.getElementById('terminosModal'));
    modal.show();
}

// Función para mostrar modal de Recuperar Contraseña
function showRecuperarPasswordModal() {
    const modal = new bootstrap.Modal(document.getElementById('recuperarPasswordModal'));
    modal.show();
}

// Función para manejar el envío del formulario de recuperar contraseña
function handleRecuperarPasswordSubmit() {
    const email = document.getElementById('emailRecuperar').value.trim();
    
    if (!isValidEmail(email)) {
        showNotification('Por favor ingresa un correo electrónico válido', 'warning');
        return;
    }
    
    // Simular envío
    
    // Mostrar mensaje de éxito
    showNotification('Se ha enviado un enlace de recuperación a tu correo electrónico', 'success');
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('recuperarPasswordModal'));
    modal.hide();
    
    // Limpiar formulario
    document.getElementById('emailRecuperar').value = '';
}

// Función para configurar el menú móvil
function setupMobileMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebarMobile = document.getElementById('sidebarMobile');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (!hamburgerMenu || !sidebarMobile || !mobileOverlay) {
        return;
    }
    
    // Asegurar estado inicial correcto
    sidebarMobile.classList.remove('active');
    mobileOverlay.classList.remove('active');
    mobileOverlay.style.display = 'none';
    hamburgerMenu.style.display = 'block';
    
    // Abrir/cerrar menú móvil con el botón hamburguesa
    hamburgerMenu.addEventListener('click', function() {
        if (sidebarMobile.classList.contains('active')) {
            toggleMobileMenu(false);
        } else {
            toggleMobileMenu(true);
        }
    });
    
    // Cerrar menú móvil con overlay
    mobileOverlay.addEventListener('click', function() {
        toggleMobileMenu(false);
    });
    
    // Cerrar menú móvil con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebarMobile.classList.contains('active')) {
            toggleMobileMenu(false);
        }
    });
    
    // Configurar navegación móvil
    const mobileNavItems = sidebarMobile.querySelectorAll('.nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            mobileNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Cerrar menú inmediatamente después de navegar
            toggleMobileMenu(false);
        });
    });
    
    // Cerrar menú cuando se redimensiona la ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            toggleMobileMenu(false);
        }
    });
}

// Función para alternar el menú móvil
function toggleMobileMenu(isOpen) {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebarMobile = document.getElementById('sidebarMobile');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (!hamburgerMenu || !sidebarMobile || !mobileOverlay) {
        return;
    }
    
    if (isOpen) {
        sidebarMobile.classList.add('active');
        mobileOverlay.classList.add('active');
        mobileOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        hamburgerMenu.style.display = 'none';
    } else {
        sidebarMobile.classList.remove('active');
        mobileOverlay.classList.remove('active');
        mobileOverlay.style.display = 'none';
        document.body.style.overflow = '';
        hamburgerMenu.style.display = 'block';
    }
}

// Exportar funciones para uso global
window.PeepsApp = {
    handleRegistroSubmit,
    handleLoginSubmit,
    showNotification,
    validateRegistroField,
    validateLoginField,
    showFieldError,
    hideFieldError,
    showTerminosModal,
    showRecuperarPasswordModal,
    handleRecuperarPasswordSubmit,
    toggleMobileMenu
};
