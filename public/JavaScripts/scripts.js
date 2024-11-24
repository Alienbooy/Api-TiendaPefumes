document.addEventListener('DOMContentLoaded', actualizarVistaSesion);

const bannerImages = [
    'imagenes/perfumes/herbaPura.jpg',
    'imagenes/perfumes/layton.jpg',
    'imagenes/perfumes/maison-peony.jpg',
];

let currentIndex = 0;

const bannerImageElement = document.getElementById('bannerImage');

function changeBannerImage() {
    currentIndex = (currentIndex + 1) % bannerImages.length;
    bannerImageElement.src = bannerImages[currentIndex];
}

setInterval(changeBannerImage, 5000);

function safeGetItem(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error(`Error al acceder a localStorage para la clave ${key}:`, error);
        return null;
    }
}

function safeRemoveItem(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error al eliminar la clave ${key} de localStorage:`, error);
    }
}

function actualizarVistaSesion() {
    const token = localStorage.getItem('token');
    const nombreUsuario = localStorage.getItem('nombre');

    console.log('Token:', token); // Verificar si hay un token
    console.log('Nombre del Usuario:', nombreUsuario); // Verificar si hay un nombre

    const authButtons = document.querySelector('.auth-buttons');
    const welcomeMessage = document.getElementById('welcome-message');

    if (!authButtons || !welcomeMessage) {
        console.error('Elementos del DOM no encontrados.');
        return;
    }

    if (token && nombreUsuario) {
        console.log('Usuario autenticado, actualizando vista...');
        welcomeMessage.textContent = `Bienvenido, ${nombreUsuario}!`;

        authButtons.innerHTML = `
            <button id="cerrar-sesion">Cerrar Sesión</button>
        `;

        const logoutButton = document.getElementById('cerrar-sesion');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                console.log('Cerrando sesión...');
                localStorage.removeItem('token');
                localStorage.removeItem('nombre');
                alert('Has cerrado sesión.');
                window.location.reload();
            });
        }
    } else {
        console.log('Usuario no autenticado, mostrando botones de inicio de sesión...');
        welcomeMessage.textContent = '¡Bienvenido!';

        authButtons.innerHTML = `
            <button onclick="location.href='login.html'">Iniciar Sesión</button>
            <button onclick="location.href='registro.html'">Crear Usuario</button>
        `;
    }
}

