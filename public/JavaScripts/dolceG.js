document.addEventListener("DOMContentLoaded", () => {
    const productosGrid = document.getElementById("productos-grid");

    async function fetchPerfumesPorMarca(marca) {
        try {
            const response = await fetch(`/api/productos/perfumes/marca?marca=${marca}`);
            if (!response.ok) {
                throw new Error("Error al obtener los perfumes");
            }
            const perfumes = await response.json();
            renderPerfumes(perfumes);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function renderPerfumes(perfumes) {
        console.log(perfumes);
        productosGrid.innerHTML = ""; 
        perfumes.forEach(perfume => {
            const perfumeHTML = `
                <div class="perfume-item">
                    <img src="${perfume.image_url}" alt="${perfume.nombre}">
                    <h2>${perfume.marca}</h2>
                    <p>${perfume.nombre}</p>
                    <p>${perfume.ml} ml - $${perfume.precio.toFixed(2)}</p>
                </div>
            `;
            productosGrid.innerHTML += perfumeHTML;
        });
    }
    
    fetchPerfumesPorMarca("Dolce Gabbana"); 
});