const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Ruta de login
app.post('/api/login', (req, res) => {
  const { email, password, tipo } = req.body;
  const archivo = tipo === 'cliente' ? 'clientes.json' : 'tecnicos.json';
  const ruta = path.join(__dirname, 'public', archivo);
  fs.readFile(ruta, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer archivo');
    const usuarios = JSON.parse(data);
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    if (usuario) {
      res.json({ exito: true, tipo });
    } else {
      res.json({ exito: false });
    }
  });
});

// Guardar solicitud
app.post('/api/solicitud', (req, res) => {
  const nuevaSolicitud = req.body;
  const archivo = path.join(__dirname, 'solicitudes.json');
  fs.readFile(archivo, 'utf8', (err, data) => {
    const solicitudes = err ? [] : JSON.parse(data);
    solicitudes.push(nuevaSolicitud);
    fs.writeFile(archivo, JSON.stringify(solicitudes, null, 2), err => {
      if (err) return res.status(500).send('Error al guardar');
      res.send('Solicitud guardada');
    });
  });
});

// Obtener solicitudes
app.get('/api/solicitudes', (req, res) => {
  const archivo = path.join(__dirname, 'solicitudes.json');
  fs.readFile(archivo, 'utf8', (err, data) => {
    if (err) return res.json([]);
    res.json(JSON.parse(data));
  });
});

// Marcar solicitud como aceptada o rechazada
app.post('/api/estado/:index', (req, res) => {
  const { estado } = req.body;
  const index = parseInt(req.params.index);
  const archivo = path.join(__dirname, 'solicitudes.json');
  fs.readFile(archivo, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error');
    const solicitudes = JSON.parse(data);
    if (solicitudes[index]) {
      solicitudes[index].estado = estado;
      fs.writeFile(archivo, JSON.stringify(solicitudes, null, 2), err => {
        if (err) return res.status(500).send('Error al guardar');
        res.send('Estado actualizado');
      });
    } else {
      res.status(404).send('Solicitud no encontrada');
    }
  });
});

// Marcar como pagado
app.post('/api/pagado/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const archivo = path.join(__dirname, 'solicitudes.json');
  fs.readFile(archivo, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error');
    const solicitudes = JSON.parse(data);
    if (solicitudes[index]) {
      solicitudes[index].pagado = true;
      fs.writeFile(archivo, JSON.stringify(solicitudes, null, 2), err => {
        if (err) return res.status(500).send('Error al guardar');
        res.send('Pagado actualizado');
      });
    } else {
      res.status(404).send('Solicitud no encontrada');
    }
  });
});

// Guardar calificación
app.post('/api/calificar/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const { estrellas, comentario } = req.body;
  const archivo = path.join(__dirname, 'solicitudes.json');
  fs.readFile(archivo, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error');
    const solicitudes = JSON.parse(data);
    if (solicitudes[index]) {
      solicitudes[index].calificacion = { estrellas, comentario };
      fs.writeFile(archivo, JSON.stringify(solicitudes, null, 2), err => {
        if (err) return res.status(500).send('Error al guardar');
        res.send('Calificación guardada');
      });
    } else {
      res.status(404).send('Solicitud no encontrada');
    }
  });
});

// Redirección a login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});