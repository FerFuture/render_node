const express = require('express');
const path = require('path');
const routes = require('./routes/routes.js');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');


app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 




const publicPath = path.join(__dirname,'..', 'frontend', 'public');


app.use(express.static(publicPath));
app.use(routes);




app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
