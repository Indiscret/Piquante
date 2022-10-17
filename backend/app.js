// Importation d'express, mongoose et body-parser
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Importation des routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const path = require('path');

require('dotenv').config();

// Connexion à la BDD MongoDB
mongoose.connect(`mongodb+srv://${process.env.USER_MONGODB}:${process.env.PASSWORD_MONGODB}@hottakes.lbwvgpp.mongodb.net/?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
  const app = express();
  
  app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');// Accès à l'api depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');// Ajouter les headers mentionnés aux requêtes envoyées vers l'api
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');// Envoie les requetes avec les méthodes mentionnées
    next();
});

app.use(bodyParser.json());

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
    
module.exports = app;