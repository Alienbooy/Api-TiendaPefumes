
const authButtons = document.querySelector('.auth-buttons');
const carritoIcon = document.querySelector('.carrito-icon');

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


function actualizarVistaSesion() {
    const token = localStorage.getItem('token'); 
    const nombreUsuario = localStorage.getItem('nombre'); 

    const welcomeMessage = document.getElementById('welcome-message');

    if (token && nombreUsuario) {
      
        welcomeMessage.textContent = `Bienvenido ${nombreUsuario}`;

      
        authButtons.innerHTML = `
            <button id="cerrar-sesion">Cerrar Sesión</button>
        `;

     
        document.getElementById('cerrar-sesion').addEventListener('click', () => {
            localStorage.removeItem('token'); 
            localStorage.removeItem('nombre'); 
            alert('Has cerrado sesión.');
            window.location.reload(); 
        });
    } else {
        
        welcomeMessage.textContent = 'Bienvenido!!!';

    
        authButtons.innerHTML = `
            <button onclick="location.href='login.html'">Iniciar Sesión</button>
            <button onclick="location.href='registro.html'">Crear Usuario</button>
        `;
    }
}

document.addEventListener('DOMContentLoaded', actualizarVistaSesion);

