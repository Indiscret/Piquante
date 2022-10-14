// Importation d'express
const express = require('express');
const router = express.Router();

// Importation des modules utilisés par les routes
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, sauceCtrl.getAllSauces);// Récupération de toutes les sauces
router.post('/', auth, multer, sauceCtrl.createSauce);// Création d'une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);// Affichage d'une sauce via son id
router.put('/:id', auth, multer, sauceCtrl.modifySauce);// Modification d'une sauce existante
router.delete('/:id', auth, sauceCtrl.deleteSauce);// Suppression d'une sauce existante
router.post('/:id/like', auth, sauceCtrl.likedSauces);// Permet de like, dislike ou rien

module.exports = router;