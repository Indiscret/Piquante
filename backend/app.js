const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const userRoutes = require('./routes/user');


mongoose.connect('mongodb+srv://Saian:1234@hottakes.lbwvgpp.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');// Accès à l'api depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');// Ajouter les headers mentionnés aux requêtes envoyées vers l'api
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');// Envoie les requetes avec les méthodes mentionnées
    next();
});

app.use(express.json());

app.use('/api/auth', userRoutes);
    
module.exports = app;