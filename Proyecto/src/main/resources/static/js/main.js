// Funcionalidades JavaScript para Peeps

document.addEventListener('DOMContentLoaded', async function () {
    initializePeepsApp();
    setupFormValidations();
    setupCardHoverEffects();
    setupMobileMenu();

    await probarConexionBackend();


    verificarUsuarioLogueado();
});

function initializePeepsApp() {
    setupSidebarNavigation();
}

function setupSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
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
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function setupFormValidations() {
    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        const inputs = registroForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateRegistroField(this);
            });
            input.addEventListener('input', function () {
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
            input.addEventListener('blur', function () {
                validateLoginField(this);
            });
            input.addEventListener('input', function () {
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

async function handleRegistroSubmit() {
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

        try {
            showNotification(' Registrando usuario...', 'info');

            const response = await fetch('/api/usuarios/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {

                localStorage.setItem('usuario', JSON.stringify(data.usuario));

                showNotification('¡Registro exitoso! Bienvenido a Peeps', 'success');

                const modal = bootstrap.Modal.getInstance(document.getElementById('registroModal'));
                modal.hide();

                form.reset();
                fields.forEach(field => {
                    field.classList.remove('is-valid', 'is-invalid');
                });

                setTimeout(() => {
                    actualizarInterfazUsuario(data.usuario);

                    //ranking de canciones 
                    const welcomeSection = document.getElementById("welcomeSection");
                    const rankingSection = document.getElementById("rankingSection");

                    if (welcomeSection) welcomeSection.classList.add("d-none");
                    if (rankingSection) rankingSection.classList.remove("d-none");
                }, 1000);

            } else {
                showNotification(` ${data.mensaje || 'Error en el registro'}`, 'danger');
            }

        } catch (error) {
            console.error('Error:', error);
            showNotification('Error de conexión. Intenta nuevamente.', 'danger');
        }
    } else {
        showNotification(' Por favor corrige los errores en el formulario', 'danger');
    }
}

async function handleLoginSubmit() {
    const form = document.getElementById('loginForm');
    const fields = form.querySelectorAll('input[required]');
    let isValid = true;

    fields.forEach(field => {
        if (!validateLoginField(field)) {
            isValid = false;
        }
    });

    if (isValid) {
        const formData = {
            email: document.getElementById('emailLogin').value,
            password: document.getElementById('passwordLogin').value,
            recordar: document.getElementById('recordarLogin').checked
        };

        try {
            showNotification('⏳ Iniciando sesión...', 'info');

            const response = await fetch('/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('usuario', JSON.stringify(data.usuario));

                showNotification(' ¡Bienvenido de vuelta!', 'success');

                const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                modal.hide();

                form.reset();
                fields.forEach(field => {
                    field.classList.remove('is-valid', 'is-invalid');
                });

                setTimeout(() => {
                    actualizarInterfazUsuario(data.usuario);

                    //ranking de canciones 
                    const welcomeSection = document.getElementById("welcomeSection");
                    const rankingSection = document.getElementById("rankingSection");

                    if (welcomeSection) welcomeSection.classList.add("d-none");
                    if (rankingSection) rankingSection.classList.remove("d-none");
                }, 1000);

            } else {
                showNotification(` ${data.mensaje || 'Error en el login'}`, 'danger');
            }

        } catch (error) {
            console.error('Error:', error);
            showNotification(' Error de conexión. Intenta nuevamente.', 'danger');
        }
    } else {
        showNotification(' Por favor corrige los errores en el formulario', 'danger');
    }
}

function handleRecuperarPasswordSubmit() {
    const email = document.getElementById('emailRecuperar').value;

    if (!isValidEmail(email)) {
        showNotification(' Por favor ingresa un correo electrónico válido', 'danger');
        return;
    }

    showNotification(' Enlace de recuperación enviado a tu correo', 'info');

    const modal = bootstrap.Modal.getInstance(document.getElementById('recuperarPasswordModal'));
    modal.hide();
}

function showTerminosModal() {
    const modal = new bootstrap.Modal(document.getElementById('terminosModal'));
    modal.show();
}

function showRecuperarPasswordModal() {
    const modal = new bootstrap.Modal(document.getElementById('recuperarPasswordModal'));
    modal.show();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    hideFieldError(field);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error-message';
    errorDiv.textContent = message;

    field.parentNode.style.position = 'relative';
    field.parentNode.appendChild(errorDiv);
}

function hideFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error-message');
    if (existingError) {
        existingError.remove();
    }
}

let activeNotification = null;

function showNotification(message, type = 'info') {
    if (activeNotification) {
        activeNotification.remove();
        activeNotification = null;
    }

    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
    `;

    const iconMap = {
        success: 'fas fa-check-circle',
        danger: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    notification.innerHTML = `
        <i class="${iconMap[type] || iconMap.info} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;


    document.body.appendChild(notification);
    activeNotification = notification;


    

    const closeBtn = notification.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
        activeNotification = null;
    });


    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
            activeNotification = null;
        }
    }, 5000);
}

function setupMobileMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const sidebarMobile = document.getElementById('sidebarMobile');

    if (hamburgerMenu && mobileOverlay && sidebarMobile) {
        hamburgerMenu.addEventListener('click', function () {
            sidebarMobile.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
        });

        mobileOverlay.addEventListener('click', function () {
            sidebarMobile.classList.remove('active');
            mobileOverlay.classList.remove('active');
        });
    }
}


function verificarUsuarioLogueado() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
        try {
            const usuarioData = JSON.parse(usuario);
            console.log('👤 Usuario logueado:', usuarioData.nombre);

            actualizarInterfazUsuario(usuarioData);
        } catch (error) {
            console.error('Error al parsear datos de usuario:', error);
        }
    }
}

function actualizarInterfazUsuario(usuario) {
    console.log('Actualizando interfaz para usuario:', usuario);

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.textContent = `¡Bienvenido ${usuario.nombre}!`;
        console.log('Título actualizado');
    }
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.textContent = 'Radio felicidad 88.9 FM - Tu música favorita te espera';
        console.log('Subtítulo actualizado');
    }

    const headerRight = document.querySelector('.header-right');
    if (headerRight) {
        headerRight.innerHTML = `
            <button class="btn-custom-outline" onclick="cerrarSesion()">
                <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
        `;
        console.log('Header actualizado');
    }

    const cards = document.querySelectorAll('.card-custom');
    cards.forEach(card => {
        card.style.display = 'none';
    });

    showNotification(`¡Hola ${usuario.nombre}! Bienvenido a Peeps`, 'success');
}

function cerrarSesion() {
    localStorage.removeItem('usuario');
    showNotification('¡Sesión cerrada!', 'info');

    setTimeout(() => {
        restaurarInterfazOriginal();

        //ranking de canciones 
        const welcomeSection = document.getElementById("welcomeSection");
        const rankingSection = document.getElementById("rankingSection");

        if (welcomeSection) welcomeSection.classList.remove("d-none");
        if (rankingSection) rankingSection.classList.add("d-none");
    }, 1000);
}

function restaurarInterfazOriginal() {
    console.log('Restaurando interfaz original');


    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.textContent = 'Bienvenido a Peeps';
    }

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.textContent = 'Radio felicidad 88.9 FM';
    }

    const headerRight = document.querySelector('.header-right');
    if (headerRight) {
        headerRight.innerHTML = `
            <button class="btn-custom-outline" data-bs-toggle="modal" data-bs-target="#loginModal">
                <i class="fas fa-user"></i> Iniciar Sesión
            </button>
            <button class="btn-custom-primary" data-bs-toggle="modal" data-bs-target="#registroModal">
                <i class="fas fa-plus"></i> Registrarse
            </button>
        `;
    }


    const cards = document.querySelectorAll('.card-custom');
    cards.forEach(card => {
        card.style.display = 'block';
    });
}

window.PeepsApp = {
    handleRegistroSubmit,
    handleLoginSubmit,
    handleRecuperarPasswordSubmit,
    showTerminosModal,
    showRecuperarPasswordModal,
    showNotification,
    cerrarSesion,
    actualizarInterfazUsuario,
    restaurarInterfazOriginal
};

//Funcionalidad para barra de busqueda (Prototipo):
// Referencias
const searchBtn = document.getElementById("searchBtn");
const overlay = document.getElementById("overlay");

// Mostrar al hacer click en el botón
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    overlay.style.display = "flex";

    // delay para animación
    setTimeout(() => {
        overlay.classList.add("active");
    }, 50);
});

// Cerrar si se hace click fuera del contenedor
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.classList.remove("active");
        setTimeout(() => {
            overlay.style.display = "none";
        }, 400); // esperar animación
    }
});
//Reproductor de música
function playSong(title, artist, src, cover) {
    const playerBar = document.getElementById("playerBar");
    const audioPlayer = document.getElementById("audioPlayer");
    const playerTitle = document.getElementById("playerTitle");
    const playerArtist = document.getElementById("playerArtist");
    const playerCover = document.getElementById("playerCover");

    playerTitle.textContent = title;
    playerArtist.textContent = artist;
    playerCover.src = cover;
    audioPlayer.src = src;

    playerBar.classList.remove("d-none");
    audioPlayer.play();
}

//Para la lista
document.querySelectorAll('.song-item').forEach(item => {
    item.addEventListener('click', () => {
        const title = item.getAttribute('data-title');
        const artist = item.getAttribute('data-artist');
        const src = item.getAttribute('data-src');
        const cover = item.getAttribute('data-cover');
        playSong(title, artist, src, cover);
    });
});

//Para el ranking
document.querySelectorAll('.ranking-song').forEach(item => {
    item.addEventListener('click', () => {
        const title = item.getAttribute('data-title');
        const artist = item.getAttribute('data-artist');
        const src = item.getAttribute('data-src');
        const cover = item.getAttribute('data-cover');
        playSong(title, artist, src, cover);
    });
});

// Simple toggle para sidebar móvil y overlay
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburgerMenu');
  const sidebarMobile = document.getElementById('sidebarMobile');
  const overlay = document.getElementById('mobileOverlay');

  function openMobile() {
    sidebarMobile.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile() {
    sidebarMobile.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    if (sidebarMobile.classList.contains('open')) closeMobile();
    else openMobile();
  });

  overlay?.addEventListener('click', closeMobile);

  // cerrar al cambiar tamaño 
  window.addEventListener('resize', () => {
    if (window.innerWidth > 991.98) closeMobile();
  });
});