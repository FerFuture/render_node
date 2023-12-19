const express = require('express');
const path = require('path');
const routes = require('./routes/routes.js');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');


app.use(cors());
app.use(bodyParser.json()); // Analiza JSON
app.use(bodyParser.urlencoded({ extended: true })); // Analiza datos codificados en URL



// Definir la ruta absoluta a la carpeta 'public' dentro de la carpeta 'frontend'
const publicPath = path.join(__dirname,'..', 'frontend', 'public');

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(publicPath));
app.use(routes);
// Definir tus rutas y lógica aquí...



app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
