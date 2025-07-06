const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Obtener todas las solicitudes
app.get('/api/solicitudes', (req, res) => {
  fs.readFile(path.join(__dirname, 'solicitudes.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer solicitudes:', err);
      return res.status(500).json({ error: 'Error al leer solicitudes' });
    }
    const solicitudes = JSON.parse(data);
    res.json(solicitudes);
  });
});

// Guardar nueva solicitud
app.post('/api/solicitudes', (req, res) => {
  const nueva = req.body;
  fs.readFile(path.join(__dirname, 'solicitudes.json'), 'utf8', (err, data) => {
    const solicitudes = JSON.parse(data);
    solicitudes.push(nueva);
    fs.writeFile(path.join(__dirname, 'solicitudes.json'), JSON.stringify(solicitudes, null, 2), err => {
      if (err) return res.status(500).send('Error al guardar');
      res.status(200).send('Solicitud guardada');
    });
  });
});

// Login cliente o técnico
app.post('/api/login', (req, res) => {
  const { email, password, tipo } = req.body;
  const archivo = tipo === 'tecnico' ? 'tecnicos.json' : 'clientes.json';

  fs.readFile(path.join(__dirname, archivo), 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error en el servidor');
    const usuarios = JSON.parse(data);
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
      res.json({ exito: true, tipo });
    } else {
      res.json({ exito: false });
    }
  });
});

// Aceptar solicitud
app.post('/api/aceptar/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const filePath = path.join(__dirname, 'solicitudes.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer solicitudes');

    const solicitudes = JSON.parse(data);
    solicitudes[index].estado = 'aceptada';

    fs.writeFile(filePath, JSON.stringify(solicitudes, null, 2), err => {
      if (err) return res.status(500).send('Error al guardar cambios');
      res.send('Solicitud aceptada');
    });
  });
});

// Rechazar solicitud
app.post('/api/rechazar/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const filePath = path.join(__dirname, 'solicitudes.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer solicitudes');

    const solicitudes = JSON.parse(data);
    solicitudes[index].estado = 'rechazada';

    fs.writeFile(filePath, JSON.stringify(solicitudes, null, 2), err => {
      if (err) return res.status(500).send('Error al guardar cambios');
      res.send('Solicitud rechazada');
    });
  });
});

// Finalizar trabajo (técnico)
app.post('/api/finalizar/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const filePath = path.join(__dirname, 'solicitudes.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer archivo');

    const solicitudes = JSON.parse(data);
    solicitudes[index].estado = 'finalizado';

    fs.writeFile(filePath, JSON.stringify(solicitudes, null, 2), err => {
      if (err) return res.status(500).send('Error al guardar');
      res.send('Solicitud marcada como finalizada');
    });
  });
});

// Confirmar pago (cliente) + calcular garantía
app.post('/api/pagado/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const filePath = path.join(__dirname, 'solicitudes.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer archivo');

    const solicitudes = JSON.parse(data);
    const hoy = new Date();
    const vencimiento = new Date();
    vencimiento.setDate(hoy.getDate() + 30);

    solicitudes[index].estado = 'pagado';
    solicitudes[index].fecha_pago = hoy.toISOString().split('T')[0];
    solicitudes[index].garantia_hasta = vencimiento.toISOString().split('T')[0];

    fs.writeFile(filePath, JSON.stringify(solicitudes, null, 2), err => {
      if (err) return res.status(500).send('Error al guardar');
      res.send('Solicitud marcada como pagada');
    });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});

// Guardar calificación del cliente al técnico
app.post('/api/calificar/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const { estrellas, comentario } = req.body;
  const filePath = path.join(__dirname, 'solicitudes.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer archivo');

    const solicitudes = JSON.parse(data);
    solicitudes[index].calificacion = {
      estrellas,
      comentario
    };

    fs.writeFile(filePath, JSON.stringify(solicitudes, null, 2), err => {
      if (err) return res.status(500).send('Error al guardar calificación');
      res.send('Calificación registrada');
    });
  });
});

// Calificación del técnico al cliente
app.post('/api/calificar-tecnico/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const { estrellas, comentario } = req.body;
  const filePath = path.join(__dirname, 'solicitudes.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer archivo');

    const solicitudes = JSON.parse(data);
    solicitudes[index].calificacionTecnico = {
      estrellas,
      comentario
    };

    fs.writeFile(filePath, JSON.stringify(solicitudes, null, 2), err => {
      if (err) return res.status(500).send('Error al guardar calificación');
      res.send('Calificación del técnico guardada');
    });
  });
});