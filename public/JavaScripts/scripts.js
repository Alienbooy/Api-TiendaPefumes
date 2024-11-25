document.addEventListener('DOMContentLoaded', actualizarVistaSesion);

function actualizarVistaSesion() {
    const token = safeGetItem('token'); 
    const nombreUsuario = safeGetItem('nombre'); 

    const authButtons = document.querySelector('.auth-buttons'); 
    const welcomeMessage = document.getElementById('welcome-message'); 

    if (!authButtons) {
        console.error('Elemento "auth-buttons" no encontrado en esta página.');
        return; 
    }

    if (token && nombreUsuario) {
        console.log('Usuario autenticado, mostrando "Cerrar Sesión"...');

        if (welcomeMessage) {
            welcomeMessage.textContent = `Bienvenido, ${nombreUsuario}!`;
        }

        authButtons.innerHTML = `
            <button id="cerrar-sesion">Cerrar Sesión</button>
        `;

        const logoutButton = document.getElementById('cerrar-sesion');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                safeRemoveItem('token'); 
                safeRemoveItem('nombre'); 
                alert('Has cerrado sesión.');
                window.location.href = './index.html'; 
            });
        }
    } else {
        console.log('Usuario no autenticado, mostrando opciones de autenticación...');

        if (welcomeMessage) {
            welcomeMessage.textContent = '¡Bienvenido!';
        }

        authButtons.innerHTML = `
            <button onclick="location.href='login.html'">Iniciar Sesión</button>
            <button onclick="location.href='registro.html'">Crear Usuario</button>
        `;
    }
}

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
