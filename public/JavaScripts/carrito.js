document.addEventListener('DOMContentLoaded', async () => {
    await obtenerCarrito(); 
});

async function obtenerCarrito() {
    const token = localStorage.getItem('token');
    const idCliente = localStorage.getItem('id_cliente');
    if (!token) {
        alert("Por favor inicia sesión.");
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch('/api/carrito/cliente', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (response.ok) {
            const carrito = await response.json();
            mostrarCarrito(carrito);
        } else {
            const error = await response.json();
            alert(error.message || "No se pudo obtener el carrito.");
        }
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        alert("Hubo un problema al conectar con el servidor.");
    }
}


function mostrarCarrito(carrito) {
    const carritoContenido = document.querySelector('.carrito-productos');
    const resumenTotal = document.querySelector('.carrito-resumen span');
    carritoContenido.innerHTML = ''; 

    let total = 0;
    carrito.forEach(item => {
        const subtotal = parseFloat(item.precio) * item.cantidad;
        total += subtotal;

        const carritoItem = `
            <div class="carrito-item">
                <img src="imagenes/perfumes/${item.id_producto}.jpg" alt="${item.nombre}">
                <div>
                    <h3>${item.nombre}</h3>
                    <p>Precio: $${parseFloat(item.precio).toFixed(2)}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                    <p>Subtotal: $${subtotal.toFixed(2)}</p>
                </div>
            </div>
        `;
        carritoContenido.innerHTML += carritoItem;
    });

    resumenTotal.textContent = `$${total.toFixed(2)} USD`;
}
