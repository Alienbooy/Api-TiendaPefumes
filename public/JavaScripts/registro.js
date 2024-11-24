const registroForm = document.getElementById('registro-form');
const errorMessages = document.getElementById('error-messages');

registroForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const nombre = document.getElementById('nombre').value.trim();

    errorMessages.style.display = 'none';
    errorMessages.innerHTML = '';

    const errores = [];

    if (!email) {
        errores.push('Por favor, ingrese su correo electrónico.');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errores.push('Por favor, ingrese un correo válido.');
    }

    if (!password) {
        errores.push('Por favor, ingrese su contraseña.');
    } else if (password.length < 8) {
        errores.push('La contraseña debe tener al menos 8 caracteres.');
    }

    if (!nombre) {
        errores.push('Por favor, ingrese su nombre.');
    }


    if (errores.length > 0) {
        errorMessages.innerHTML = errores.map(err => `<p>${err}</p>`).join('');
        errorMessages.style.display = 'block';
        return;
    }


    try {
        const response = await fetch('api/cliente/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, nombre })
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message || 'Usuario registrado exitosamente.');
            registroForm.reset(); 
            
        } else {
            const error = await response.json();
            errorMessages.innerHTML = `<p>${error.message || 'Error al registrar el usuario.'}</p>`;
            errorMessages.style.display = 'block';
        }
    } catch (error) {
        errorMessages.innerHTML = `<p>Error al conectarse con el servidor.</p>`;
        errorMessages.style.display = 'block';
        console.error(error);
    }
});
