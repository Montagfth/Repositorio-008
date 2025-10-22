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
                    const listaCanciones = document.getElementById("listaCanciones");

                    if (welcomeSection) welcomeSection.classList.add("d-none");
                    if (rankingSection) rankingSection.classList.remove("d-none");
                    if (listaCanciones) listaCanciones.classList.remove("d-none");
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
                    const listaCanciones = document.getElementById("listaCanciones");

                    if (welcomeSection) welcomeSection.classList.add("d-none");
                    if (rankingSection) rankingSection.classList.remove("d-none");
                    if (listaCanciones) listaCanciones.classList.remove("d-none");
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

    //  Detener música y ocultar reproductor
    const audioPlayer = document.getElementById("audioPlayer");
    const playerBar = document.getElementById("playerBar");
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0; // reinicia la canción
    }
    if (playerBar) {
        playerBar.classList.add("d-none"); // oculta el reproductor
    }

    setTimeout(() => {
        restaurarInterfazOriginal();

        //ranking de canciones 
        const welcomeSection = document.getElementById("welcomeSection");
        const rankingSection = document.getElementById("rankingSection");
        const listaCanciones = document.getElementById("listaCanciones");

        if (welcomeSection) welcomeSection.classList.remove("d-none");
        if (rankingSection) rankingSection.classList.add("d-none");
        if (listaCanciones) listaCanciones.classList.add("d-none");
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
//=========================

//Reproductor de música
function playSong(title, artist, src, cover) {
    const url = `/music/reproductor?titulo=${encodeURIComponent(title)}&artista=${encodeURIComponent(artist)}&src=${encodeURIComponent(src)}&cover=${encodeURIComponent(cover)}`;

    window.location.href = url;
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

// =========================
// Funcionalidad: Barra de búsqueda de canciones
// =========================
// Incio:
// Referencias principales
const searchBtn = document.getElementById("searchBtn");
const searchOverlay = document.getElementById("overlay");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
// Nuevas adherencias:
const resultsContainer = document.getElementById("songsResults");
const audioPlayer = document.getElementById("audioPlayerSearch");
let currentSong = null;


// Mostrar el overlay
searchBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    searchOverlay.style.display = "flex";

    setTimeout(() => {
        searchOverlay.classList.add("active");
        searchInput.focus();
    }, 50);
    document.body.classList.add("modal-open");
});

// Cerrar overlay al hacer click fuera
searchOverlay?.addEventListener("click", (e) => {
    if (e.target === searchOverlay) {
        searchOverlay.classList.remove("active");
        setTimeout(() => {
            searchOverlay.style.display = "none";
            searchInput.value = "";
            searchResults.innerHTML = "";
            //  Detener canción si estaba sonando
            // NOTA: Puede mejorarse con un fade de la cancion.
            if (!audioPlayer.paused) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0; // reiniciar
            }
            currentSong = null;
            document.body.classList.remove("modal-open");
        }, 300);
    }
});

// Crear un item de canción (mock)
function createSongItem(title, artist, cover, src) {
    const li = document.createElement("div");
    li.classList.add("song-item");

    li.innerHTML = `
        <img src="${cover}" alt="${title}" class="cover-thumb">
        <div class="song-info">
            <h5>${title}</h5>
            <small>${artist}</small>
        </div>
        <div class="song-actions">
            <button class="play-btn"><i class="fas fa-play"></i></button>
            <button class="add-btn"><i class="fas fa-plus"></i></button>
        </div>
    `;

    const playBtn = li.querySelector(".play-btn");

    playBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        if (currentSong === src && !audioPlayer.paused) {
            // pausa
            audioPlayer.pause();
            playBtn.innerHTML = `<i class="fas fa-play"></i>`;
        } else {
            // reproducir
            audioPlayer.src = src;
            audioPlayer.play();
            currentSong = src;

            // resetear todos los botones a "play"
            document.querySelectorAll(".play-btn").forEach(btn => btn.innerHTML = `<i class="fas fa-play"></i>`);
            playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        }
    });

    return li;
}

// Filtrar canciones (mock)
searchInput?.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    searchResults.innerHTML = "";

    if (!query) return;

    const cancionesMock = [
        // Cancion 02
        { title: "AM Remix", artist: "Nio Garcia x J Balvin x Bad Bunny", cover: "/images/AM Remix.jpg", src: "/audio/AM Remix.mp3" },
        // Cancion 03
        { title: "Bohemian Rhapsody", artist: "Queen", cover: "/images/Bohemian Rhapsody.jpg", src: "/audio/Bohemian Rhapsody.mp3" },
        // Cancion 04
        { title: "cabellos blancos", artist: "Carmencita Lara", cover: "/images/cabellos blancos.jpg", src: "/audio/cabellos blancos.mp3" },
        // Cancion 05
        { title: "carta al cielo", artist: "Lucha Reyes", cover: "/images/carta al cielo.jpg", src: "/audio/carta al cielo.mp3" },
        // Cancion 06
        { title: "Chillax", artist: "Farruko", cover: "/images/Chillax.jpg", src: "/audio/Chillax.mp3" },
        // Cancion 07
        { title: "Con Altura", artist: "J Balvin x Rosalía", cover: "/images/Con Altura.jpg", src: "/audio/Con Altura.mp3" },
        // Cancion 08
        { title: "Dakiti", artist: "Bad Bunny", cover: "/images/Dakiti.jpg", src: "/audio/Dakiti.mp3" },
        // Cancion 09
        { title: "Despechá", artist: "Rosalia", cover: "/images/Despechá.jpg", src: "/audio/Despechá.mp3" },
        // Cancion 10
        { title: "DtMF", artist: "Bad Bunny", cover: "/images/DtMF.jpg", src: "/audio/DtMF.mp3" },
        // Cancion 11
        { title: "Ella y Yo", artist: "Aventura (Ft. Don Omar)", cover: "/images/Ella y Yo.jpg", src: "/audio/Ella y Yo.mp3" },
        // Cancion 12
        { title: "Felices los 4", artist: "Maluma", cover: "/images/Felices los 4.jpg", src: "/audio/Felices los 4.mp3" },
        // Cancion 13
        { title: "Hawái", artist: "Maluma", cover: "/images/Hawái.jpg", src: "/audio/Hawái.mp3" },
        // Cancion 14
        { title: "La Alergia", artist: "Donny Caballero", cover: "/images/La Alergia.jpg", src: "/audio/La Alergia.mp3" },
        // Cancion 15
        { title: "La Botella", artist: "Justin Quiles & Maluma", cover: "/images/La Botella.jpg", src: "/audio/La Botella.mp3" },
        // Cancion 16
        { title: "La Cancion", artist: "Bad Bunny & J Balvin", cover: "images/La Canción.jpg", src: "/audio/La Canción.mp3" },
        // Cancion 17
        { title: "Lo Pasado, Pasado", artist: "José José", cover: "/images/Lo Pasado, Pasado.jpg", src: "/audio/Lo Pasado, Pasado.mp3" },
        // Cancion 18
        { title: "Me Porto Bonito", artist: "Bad Bunny", cover: "images/Me Porto Bonito.jpg", src: "audio/Me Porto Bonito.mp3" },
        // Cancion 19
        { title: "Me Rehúso", artist: "Danny Ocean", cover: "/images/Me Rehúso.jpg", src: "/audio/Me Rehúso.mp3" },
        // Cancion 20
        { title: "Monotonía", artist: "Shakira", cover: "/images/Monotonía.jpg", src: "/audio/Monotonía.mp3" },
        // Cancion 21
        { title: "Ojitos Lindos", artist: "Bad Bunny & Bomba Estéreo", cover: "/images/Ojitos Lindos.jpg", src: "/audio/Ojitos Lindos.mp3" },
        // Cancion 22
        { title: "Otro Trago", artist: "Darell & Sech", cover: "/images/Otro Trago.jpg", src: "/audio/Otro Trago.mp3" },
        // Cancion 23
        { title: "Pa Mi (Remix)", artist: "Alex, Dimelo Flow & Rafa Pabón", cover: "/images/Pa Mi (Remix).jpg", src: "/audio/Pa Mi (Remix).mp3" },
        // Cancion 24
        { title: "Pareja del Año", artist: "Myke Towers & Sebastián Yatra", cover: "/images/Pareja del Año.jpg", src: "/audio/Pareja del Año.mp3" },
        // Cancion 25
        { title: "Qué Más Pues", artist: "J Balvin & Maria Becerra", cover: "/images/Qué Más Pues.jpg", src: "/audio/Qué Más Pues.mp3" },
        // Cancion 26
        { title: "Salió el Sol", artist: "Don Omar", cover: "/images/Salió el Sol.jpg", src: "/audio/Salió el Sol.mp3" },
        // Cancion 27
        { title: "Sunset", artist: "Farruko", cover: "/images/Sunset.jpg", src: "/audio/Sunset.mp3" },
        // Cancion 28
        { title: "Tacones Rojos", artist: "Sebastián Yatra", cover: "/images/Tacones Rojos.jpg", src: "/audio/Tacones Rojos.mp3" },
        // Cancion 29
        { title: "Tal Vez", artist: "Paulo Londra", cover: "/images/Tal Vez.jpg", src: "/audio/Tal Vez.mp3" },
        // Cancion 30
        { title: "Tití Me Preguntó", artist: "Bad Bunny", cover: "/images/Tití Me Preguntó.jpg", src: "/audio/Tití Me Preguntó.mp3" },
        // Cancion 31
        { title: "Todo De Ti", artist: "Rauw Alejandro", cover: "/images/Todo De Ti.jpg", src: "/audio/Todo De Ti.mp3" },
        // Cancion 32
        { title: "Volví", artist: "Aventura & Bad Bunny", cover: "/images/Volví.jpg", src: "/audio/Volví.mp3" },
    ];

    const filtradas = cancionesMock.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.artist.toLowerCase().includes(query)
    );

    if (filtradas.length === 0) {
        searchResults.innerHTML = `<p style="text-align:center;color:#888;">No se encontraron canciones</p>`;
        return;
    }

    // Experimental | Funcional
    filtradas.forEach(c => {
        const item = createSongItem(c.title, c.artist, c.cover, c.src);
        searchResults.appendChild(item);

        // animación suave
        setTimeout(() => item.classList.add("show"), 50);
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
// Fin
// =========================
// Funcionalidad: Barra de búsqueda de canciones
// =========================