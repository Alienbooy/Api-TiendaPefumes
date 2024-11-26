document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');

    if (!loginForm || !loginButton) {
        console.error('Formulario o botón de login no encontrados.');
        return;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = 'Cargando...';

        try {
            const response = await fetch('api/cliente/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);

                localStorage.setItem('token', data.token);
                localStorage.setItem('nombre', data.nombre);
                localStorage.setItem('id_cliente', data.id_cliente);

                window.location.href = './index.html';
            } else if (response.status === 401) {
                alert('Correo o contraseña incorrectos.');
            } else if (response.status === 404) {
                alert('Usuario no encontrado.');
            } else {
                const error = await response.json();
                alert(error.message || 'Error al iniciar sesión.');
            }
        } catch (error) {
            if (error.name === 'TypeError') {
                alert('No se pudo conectar con el servidor. Por favor, inténtelo más tarde.');
            } else {
                alert('Ocurrió un error inesperado.');
            }
            console.error(error);
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Iniciar Sesión';
        }
    });
});
