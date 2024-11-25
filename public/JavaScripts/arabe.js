document.addEventListener("DOMContentLoaded", () => {
    const productosGrid = document.getElementById("productos-grid");
    console.log("productosGrid:", productosGrid);

    if (!productosGrid) {
        console.error("El contenedor con ID 'productos-grid' no existe en el DOM.");
        return;
    }
    
    async function fetchPerfumes() {
        try {
            const response = await fetch("/api/productos/perfumes");
            if (!response.ok) {
                throw new Error("Error al obtener los perfumes");
            }
            const perfumes = await response.json();
            console.log(perfumes); 
            renderProductos(perfumes);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    

    
    function renderProductos(perfumes) {
        productosGrid.innerHTML = "";
        perfumes.forEach(perfume => {
            const ml = perfume.ml || "No especificado";
            const precio = perfume.precio ? `$${Number(perfume.precio).toFixed(2)}` : "Precio no disponible";
            const stock = perfume.stock || "Sin stock";
    
            const productoHTML = `
                <div class="producto-item">
                    <img src="${perfume.image_url}" alt="${perfume.nombre}">
                    <h2>${perfume.marca}</h2>
                    <p>${perfume.nombre}</p>
                    <p>${ml} ml - ${precio}</p>
                </div>
            `;
            productosGrid.innerHTML += productoHTML;
        });
    }
    
    

    fetchPerfumes();
});
