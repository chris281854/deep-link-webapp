const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar headers CORS para permitir acceso desde la herramienta de Google
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Configurar headers específicos para .well-known
  if (req.path.startsWith('/.well-known/')) {
    res.header('Content-Type', 'application/json');
    res.header('Cache-Control', 'public, max-age=3600');
  }
  
  next();
});

// Servir archivos estáticos
app.use(express.static(__dirname));

// Ruta específica para assetlinks.json
app.get('/.well-known/assetlinks.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, '.well-known', 'assetlinks.json'));
});

// Ruta por defecto
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 