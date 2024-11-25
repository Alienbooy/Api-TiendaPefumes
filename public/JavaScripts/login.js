document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        const response = await fetch('api/cliente/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            alert('Inicio de sesión exitoso.');

            localStorage.setItem('token', data.token);
            localStorage.setItem('nombre', data.nombre);

            window.location.href = './index.html'; 
        } else {
            const error = await response.json();
            alert(error.message || 'Error al iniciar sesión.');
        }
    } catch (error) {
        alert('No se pudo conectar con el servidor.');
        console.error(error);
    }
});
