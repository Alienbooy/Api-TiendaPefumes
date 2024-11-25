document.addEventListener("DOMContentLoaded", () => {
    const combosGrid = document.getElementById("combos-grid");

    async function fetchCombos() {
        try {
            const response = await fetch("/api/productos/combos");
            console.log("Estado de la respuesta:", response.status);
            if (!response.ok) {
                throw new Error("Error al obtener los combos");
            }
            const combos = await response.json();
            console.log("Combos obtenidos:", combos);
            renderCombos(combos);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    
    

    function renderCombos(combos) {
        combosGrid.innerHTML = "";
        combos.forEach(combo => {
            const comboHTML = `
                <div class="combo-item">
                    <img src="${combo.image_url}" alt="${combo.nombre}">
                    <h2>${combo.nombre}</h2>
                    <p class="price">$${combo.precio.toFixed(2)}</p>
                </div>
            `;
            combosGrid.innerHTML += comboHTML; 
        });
    }

    fetchCombos();
});

