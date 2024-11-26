document.addEventListener("DOMContentLoaded", async () => {
    const productoContainer = document.getElementById("producto-container");
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        productoContainer.innerHTML = "<p>Error: No se especificó un producto.</p>";
        return;
    }

    try {
        const response = await fetch(`/api/productos/${productId}`);
        if (!response.ok) {
            throw new Error("Error al obtener el detalle del producto");
        }

        const producto = await response.json();

        productoContainer.innerHTML = `
            <div class="producto-imagen">
                <img src="${producto.image_url}" alt="${producto.nombre}">
            </div>
            <div class="producto-info">
                <h1>${producto.nombre}</h1>
                <p>${producto.descripcion}</p>
                <p><strong>${producto.nombre} Eau De Parfum</strong></p>
                <p>${producto.ml} ml - $${producto.precio.toFixed(2)}</p>
                <div class="opciones">
                    <button class="btn-agregar" data-id="${producto.id_producto}" data-ml="${producto.ml}" data-precio="${producto.precio}">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        `;

        document.querySelector(".btn-agregar").addEventListener("click", () => {
            const idProducto = document.querySelector(".btn-agregar").dataset.id;
            agregarAlCarrito(idProducto);
        });
    } catch (error) {
        console.error("Error:", error);
        productoContainer.innerHTML = "<p>Error al cargar los detalles del producto.</p>";
    }
});

async function agregarAlCarrito(idProducto) {
    const idCliente = localStorage.getItem("id_cliente");
    const token = localStorage.getItem("token");
    if (!token || !idCliente) {
        alert("Por favor, inicia sesión para agregar productos al carrito.");
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch("/api/carrito/agregar", {
            method: "POST",
            headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
            body: JSON.stringify({ id_cliente: idCliente, id_producto: idProducto, cantidad: 1 }),
        });

        if (!response.ok) {
            throw new Error("No se pudo agregar el producto al carrito.");
        }

        alert("Producto agregado al carrito.");
    } catch (error) {
        console.error("Error al agregar al carrito:", error);
    }
}
