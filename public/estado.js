function buscarSolicitud() {
  const nombre = document.getElementById('nombre').value.trim().toLowerCase();
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = '';

  fetch('/api/solicitudes')
    .then(res => res.json())
    .then(data => {
      const solicitudes = data
        .map((s, i) => ({ ...s, index: i }))
        .filter(s => s.nombre.toLowerCase() === nombre);

      if (solicitudes.length === 0) {
        resultado.innerHTML = '<p>No se encontraron solicitudes con ese nombre.</p>';
        return;
      }

      // Mostrar reputación general del técnico
      const calificaciones = data.filter(s => s.calificacion).map(s => s.calificacion.estrellas);
      if (calificaciones.length > 0) {
        const suma = calificaciones.reduce((a, b) => a + b, 0);
        const promedio = (suma / calificaciones.length).toFixed(1);
        resultado.innerHTML += <p><strong>⭐ Reputación del técnico:</strong> ${promedio} (${calificaciones.length} calificaciones)</p>;
      }

      solicitudes.forEach(s => {
        let estadoTexto = '';
        switch (s.estado) {
          case 'aceptada': estadoTexto = '🟢 Aceptada'; break;
          case 'rechazada': estadoTexto = '🔴 Rechazada'; break;
          case 'finalizado': estadoTexto = '✅ Finalizado'; break;
          case 'pagado': estadoTexto = '💰 Pagado (Garantía activa)'; break;
          default: estadoTexto = '🟡 Pendiente';
        }

        const div = document.createElement('div');
        div.classList.add('solicitud');
        div.innerHTML = `
          <hr>
          <h3>Solicitud</h3>
          <p><strong>Zona:</strong> ${s.zona}</p>
          <p><strong>Servicio:</strong> ${s.servicio}</p>
          <p><strong>Descripción:</strong> ${s.descripcion}</p>
          <p><strong>Estado:</strong> ${estadoTexto}</p>
        `;

        if (s.estado === 'finalizado') {
          const btn = document.createElement('button');
          btn.textContent = '✅ Marcar como Pagado';
          btn.onclick = () => marcarPagado(s.index);
          div.appendChild(btn);
        }

        if (s.estado === 'pagado') {
          div.innerHTML += `
            <p><strong>Fecha de pago:</strong> ${s.fecha_pago}</p>
            <p><strong>Garantía válida hasta:</strong> ${s.garantia_hasta}</p>
          `;

          if (!s.calificacion) {
            div.innerHTML += `
              <h4>Calificá al técnico:</h4>
              <label>Estrellas (1 a 5):</label>
              <input type="number" id="estrellas-${s.index}" min="1" max="5"><br>
              <label>Comentario:</label><br>
              <textarea id="comentario-${s.index}" rows="2" cols="30"></textarea><br>
              <button onclick="enviarCalificacion(${s.index})">📩 Enviar Calificación</button>
            `;
          } else {
            div.innerHTML += `
              <p><strong>Tu calificación:</strong> ⭐ ${s.calificacion.estrellas}</p>
              <p><strong>Comentario:</strong> ${s.calificacion.comentario}</p>
            `;
          }
        }

        resultado.appendChild(div);
      });
    })
    .catch(err => {
      console.error('Error al buscar solicitud:', err);
      resultado.innerHTML = '<p>Error al buscar la solicitud.</p>';
    });
}

function marcarPagado(index) {
  fetch(`/api/pagado/${index}`, { method: 'POST' }).then(() => buscarSolicitud());
}

function enviarCalificacion(index) {
  const estrellas = parseInt(document.getElementById(`estrellas-${index}`).value);
  const comentario = document.getElementById(`comentario-${index}`).value;

  if (!estrellas || estrellas < 1 || estrellas > 5) {
    alert("Ingresá una calificación válida (1 a 5 estrellas)");
    return;
  }

  fetch(`/api/calificar/${index}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estrellas, comentario })
  }).then(() => buscarSolicitud());
}