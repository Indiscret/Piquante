// Importation d'express et du module utilisé pour la route
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);// Inscription de l'utilisateur
router.post('/login', userCtrl.login);// Connexion de l'utilisateur

module.exports = router;