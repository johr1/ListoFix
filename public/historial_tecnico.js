function cargarHistorial() {
  fetch('/api/solicitudes')
    .then(res => res.json())
    .then(data => {
      const aceptadas = document.getElementById('aceptadas');
      const rechazadas = document.getElementById('rechazadas');

      aceptadas.innerHTML = '';
      rechazadas.innerHTML = '';

      data.forEach((sol) => {
        const div = document.createElement('div');
        div.classList.add('solicitud');
        div.innerHTML = `
          <p><strong>Nombre:</strong> ${sol.nombre}</p>
          <p><strong>Zona:</strong> ${sol.zona}</p>
          <p><strong>Servicio:</strong> ${sol.servicio}</p>
          <p><strong>Descripción:</strong> ${sol.descripcion}</p>
          <p><strong>Estado:</strong> ${sol.estado}</p>
          <hr>
        `;

        if (sol.estado === 'aceptada') {
          aceptadas.appendChild(div);
        } else if (sol.estado === 'rechazada') {
          rechazadas.appendChild(div);
        }
      });
    });
}

cargarHistorial();