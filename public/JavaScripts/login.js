const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Inicio de sesión exitoso.');
            localStorage.setItem('token', data.token); // Guardar token en el almacenamiento local
            window.location.href = '/index.html'; // Redirigir a la página principal
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        alert('Error al conectarse con el servidor.');
        console.error(error);
    }
});
