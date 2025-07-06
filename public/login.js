document.getElementById('form-login').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const tipo = document.getElementById('tipo').value;
  const mensaje = document.getElementById('mensaje');

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, tipo })
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        mensaje.innerText = 'Inicio de sesión exitoso';
        if (tipo === 'cliente') {
          window.location.href = '/estado.html';
        } else {
          window.location.href = '/tecnicos.html';
        }
      } else {
        mensaje.innerText = 'Email o contraseña incorrectos';
      }
    })
    .catch(err => {
      mensaje.innerText = 'Error al iniciar sesión';
      console.error(err);
    });
});