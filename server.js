const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Configurar CORS para todas las rutas
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Ruta específica para assetlinks.json con respuesta directa
app.get('/.well-known/assetlinks.json', (req, res) => {
  console.log('Assetlinks.json requested');
  
  const assetlinks = [{
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.jimetrixenterprise.deeplink",
      "sha256_cert_fingerprints": [
        "7F:21:7A:EE:27:9F:03:ED:C3:CD:45:B8:4C:1D:A6:F9:73:2C:C5:1F:24:A2:C7:C2:F5:93:A3:60:07:EF:80:44"
      ]
    }
  }];
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.json(assetlinks);
});

// Ruta para manejar diferentes Pokémon
app.get('/pokemon/:id', (req, res) => {
  const pokemonId = req.params.id;
  console.log(`Pokemon requested: ${pokemonId}`);
  
  // Crear una página HTML dinámica para el Pokémon con el estilo de Flutter
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pokemon ${pokemonId}</title>
        <link rel="stylesheet" href="/styles.css">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    </head>
    <body>
        <div class="pokemon-container">
            <!-- Header con navegación -->
            <header class="pokemon-header">
                <a href="/" class="back-button">
                    <span class="material-icons">arrow_back</span>
                    Volver
                </a>
                <h1>Pokémon</h1>
                <div class="header-actions">
                    <button class="action-button" onclick="sharePokemon()">
                        <span class="material-icons">share</span>
                    </button>
                    <button class="action-button" onclick="getRandomPokemon()">
                        <span class="material-icons">shuffle</span>
                    </button>
                </div>
            </header>

            <!-- Card principal del Pokémon -->
            <div class="pokemon-main-card">
                <div class="pokemon-image-container">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" 
                         alt="Pokemon ${pokemonId}" 
                         class="pokemon-image"
                         onerror="this.src='https://via.placeholder.com/250x200?text=Pokemon+${pokemonId}'">
                </div>
                <div class="pokemon-details">
                    <h2 class="pokemon-name">POKEMON ${pokemonId}</h2>
                    <div class="pokemon-id-badge">
                        ID: ${pokemonId}
                    </div>
                </div>
            </div>

            <!-- Información del Pokémon -->
            <div class="info-card">
                <h3 class="card-title">Información del Pokémon</h3>
                <div class="info-row">
                    <span class="info-label">ID:</span>
                    <span class="info-value">${pokemonId}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Nombre:</span>
                    <span class="info-value">Pokemon ${pokemonId}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">URL de Imagen:</span>
                    <a href="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" 
                       class="info-url" target="_blank">
                        Ver imagen original
                    </a>
                </div>
            </div>

            <!-- Acciones rápidas -->
            <div class="quick-actions-card">
                <h3 class="card-title">Acciones Rápidas</h3>
                <div class="actions-grid">
                    <button class="action-btn" onclick="getRandomPokemon()">
                        <span class="material-icons">shuffle</span>
                        <span>Aleatorio</span>
                    </button>
                    <button class="action-btn" onclick="clearPokemon()">
                        <span class="material-icons">clear_all</span>
                        <span>Limpiar</span>
                    </button>
                    <button class="action-btn" onclick="showStatus()">
                        <span class="material-icons">info</span>
                        <span>Estado</span>
                    </button>
                </div>
            </div>

            <!-- Información de caché -->
            <div class="cache-info-card">
                <div class="cache-row">
                    <span class="cache-label">Caché:</span>
                    <span class="cache-value">0 Pokémon guardados</span>
                    <button class="cache-details-btn" onclick="showCacheStats()">
                        Ver detalles
                    </button>
                </div>
            </div>
        </div>

        <script>
            function sharePokemon() {
                if (navigator.share) {
                    navigator.share({
                        title: 'Pokemon ${pokemonId}',
                        text: '¡Mira este Pokémon!',
                        url: window.location.href
                    });
                } else {
                    // Fallback para navegadores que no soportan Web Share API
                    navigator.clipboard.writeText(window.location.href);
                    alert('URL copiada al portapapeles');
                }
            }

            function getRandomPokemon() {
                const randomId = Math.floor(Math.random() * 1000) + 1;
                window.location.href = '/pokemon/' + randomId;
            }

            function clearPokemon() {
                window.location.href = '/';
            }

            function showStatus() {
                alert('Estado: Pokemon ${pokemonId} cargado correctamente');
            }

            function showCacheStats() {
                alert('Estadísticas de Caché:\\n\\nPokémon en caché: 0\\nEstado: Pokemon ${pokemonId} cargado');
            }
        </script>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Ruta para la lista de Pokémon
app.get('/pokemons', (req, res) => {
  console.log('Pokemons list requested');
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lista de Pokemons</title>
        <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
        <div class="container">
            <h1>Lista de Pokemons</h1>
            <div class="pokemon-grid">
                ${generatePokemonGrid()}
            </div>
            <a href="/" class="back-link">← Volver al inicio</a>
        </div>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Función para generar la cuadrícula de Pokémon
function generatePokemonGrid() {
  let grid = '';
  for (let i = 1; i <= 20; i++) {
    grid += `
      <div class="pokemon-card">
        <a href="/pokemon/${i}">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png" 
               alt="Pokemon ${i}"
               onerror="this.src='https://via.placeholder.com/100x100?text=${i}'">
          <p>Pokemon ${i}</p>
        </a>
      </div>
    `;
  }
  return grid;
}

// Servir archivos estáticos
app.use(express.static(__dirname));

// Ruta por defecto
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Assetlinks.json available at: http://localhost:${PORT}/.well-known/assetlinks.json`);
  console.log(`Pokemon routes available at: http://localhost:${PORT}/pokemon/:id`);
  console.log(`Pokemons list available at: http://localhost:${PORT}/pokemons`);
}); 