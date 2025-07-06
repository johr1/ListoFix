document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/solicitudes')
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById('lista-historial');

      const aceptadas = data.filter(solicitud => solicitud.estado === 'aceptada');

      if (aceptadas.length === 0) {
        contenedor.innerHTML = '<p>No hay trabajos aceptados aún.</p>';
        return;
      }

      aceptadas.forEach((solicitud, i) => {
        const item = document.createElement('div');
        item.classList.add('solicitud');

        item.innerHTML = `
          <h3>Trabajo #${i + 1}</h3>
          <p><strong>Nombre:</strong> ${solicitud.nombre}</p>
          <p><strong>Zona:</strong> ${solicitud.zona}</p>
          <p><strong>Servicio:</strong> ${solicitud.servicio}</p>
          <p><strong>Descripción:</strong> ${solicitud.descripcion}</p>
          <p><strong>Fecha:</strong> ${solicitud.fecha}</p>
          <p><strong>Estado:</strong> ${solicitud.estado}</p>
          <hr/>
        `;

        contenedor.appendChild(item);
      });
    })
    .catch(err => {
      console.error('Error al cargar historial:', err);
    });
});