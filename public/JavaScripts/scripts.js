// Array de imágenes del banner
const bannerImages = [
    'imagenes/perfumes/herbaPura.jpg',
    'imagenes/perfumes/layton.jpg',
    'imagenes/perfumes/maison-peony.jpg',
];

let currentIndex = 0;

// Seleccionar el elemento de la imagen del banner
const bannerImageElement = document.getElementById('bannerImage');

// Función para cambiar la imagen
function changeBannerImage() {
    currentIndex = (currentIndex + 1) % bannerImages.length;
    bannerImageElement.src = bannerImages[currentIndex];
}

// Cambiar imagen cada 5 segundos
setInterval(changeBannerImage, 5000);

