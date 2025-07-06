function cargarSolicitudes() {
  fetch('/api/solicitudes')
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById('lista-solicitudes');
      lista.innerHTML = '';

      // Calcular promedio técnico
      const calificaciones = data
        .filter(s => s.calificacion)
        .map(s => s.calificacion.estrellas);

      if (calificaciones.length > 0) {
        const suma = calificaciones.reduce((a, b) => a + b, 0);
        const promedio = (suma / calificaciones.length).toFixed(1);
        const reputacion = document.createElement('p');
        reputacion.innerHTML = `<strong>⭐ Tu reputación:</strong> ${promedio} (${calificaciones.length} calificaciones)`;
        lista.appendChild(reputacion);
      }

      data.forEach((sol, index) => {
        if (sol.estado === 'rechazada') return;

        const div = document.createElement('div');
        div.classList.add('solicitud');

        div.innerHTML = `
          <hr>
          <p><strong>Nombre:</strong> ${sol.nombre}</p>
          <p><strong>Zona:</strong> ${sol.zona}</p>
          <p><strong>Servicio:</strong> ${sol.servicio}</p>
          <p><strong>Descripción:</strong> ${sol.descripcion}</p>
          <p><strong>Estado:</strong> ${sol.estado ?? 'pendiente'}</p>
        `;

        if (!sol.estado || sol.estado === 'pendiente') {
          div.innerHTML += `
            <button onclick="aceptar(${index})">✅ Aceptar</button>
            <button onclick="rechazar(${index})">❌ Rechazar</button>
          `;
        } else if (sol.estado === 'aceptada') {
          div.innerHTML += `
            <button onclick="finalizar(${index})">🔧 Marcar como Finalizado</button>
          `;
        }

        if (sol.estado === 'pagado') {
          if (!sol.calificacionTecnico) {
            div.innerHTML += `
              <h4>Calificá al cliente:</h4>
              <label>Estrellas (1 a 5):</label>
              <input type="number" id="tec-estrellas-${index}" min="1" max="5"><br>
              <label>Comentario:</label><br>
              <textarea id="tec-comentario-${index}" rows="2" cols="30"></textarea><br>
              <button onclick="enviarCalificacionTecnico(${index})">📩 Enviar Calificación</button>
            `;
          } else {
            div.innerHTML += `
              <p><strong>Calificación al cliente:</strong> ⭐ ${sol.calificacionTecnico.estrellas}</p>
              <p><strong>Comentario:</strong> ${sol.calificacionTecnico.comentario}</p>
            `;
          }
        }

        lista.appendChild(div);
      });
    });
}

function aceptar(index) {
  fetch(`/api/aceptar/${index}`, { method: 'POST' }).then(() => cargarSolicitudes());
}
function rechazar(index) {
  fetch(`/api/rechazar/${index}`, { method: 'POST' }).then(() => cargarSolicitudes());
}
function finalizar(index) {
  fetch(`/api/finalizar/${index}`, { method: 'POST' }).then(() => cargarSolicitudes());
}
function enviarCalificacionTecnico(index) {
  const estrellas = parseInt(document.getElementById(`tec-estrellas-${index}`).value);
  const comentario = document.getElementById(`tec-comentario-${index}`).value;

  if (!estrellas || estrellas < 1 || estrellas > 5) {
    alert("Ingresá una calificación válida (1 a 5 estrellas)");
    return;
  }

  fetch(`/api/calificar-tecnico/${index}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estrellas, comentario })
  }).then(() => cargarSolicitudes());
}

cargarSolicitudes();