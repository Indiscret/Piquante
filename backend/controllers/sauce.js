// Importation du model Sauce et File Systeme pour Multer
const Sauce = require('../models/Sauce');
const fs = require('fs');


// Création de la sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
        .catch(error => res.status(400).json({ error }));
};

// Modification d'une sauce existante que seul l'utilisateur à ajouté
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId ){
                res.status(401).json({message: 'Non autorisé'});
            } else {
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'sauce modifiée'}))
                .catch(error => res.status(401).json({error}));
            }
        })
        .catch((error) => {
            res.status(400).json({error});
        });
};

// Suppression de la sauce que seul l'utilisateur à ajouté
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Vous n\'êtes pas autorisé à supprimer cette sauce' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                        .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
};

// Obtention d'une sauce via son id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Obtention de toutes les sauces ajoutés
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Permet de like les sauces, les dislikes ou ne rien faire
exports.likedSauces = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (!sauce.usersLiked.includes(req.auth.userId) && req.body.like === 1) {
                Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: req.auth.userId } })
                    .then(() => res.status(200).json({ message: 'Like enregistré' }))
                    .catch(error => res.status(400).json({ error }));
            } else if (!sauce.usersDisliked.includes(req.auth.userId) && req.body.like === -1) {
                Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $push: { usersDisliked: req.auth.userId } })
                    .then(() => res.status(200).json({ message: 'Dislike enregistré' }))
                    .catch(error => res.status(400).json({ error }));
            } else if (sauce.usersLiked.includes(req.auth.userId) && req.body.like === 0) {
                Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.auth.userId } })
                    .then(() => res.status(200).json({ message: 'Like annulé' }))
                    .catch(error => res.status(400).json({ error }));
            } else if (sauce.usersDisliked.includes(req.auth.userId) && req.body.like === 0) {
                Sauce.findOneAndUpdate({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.auth.userId } })
                    .then(() => res.status(200).json({ message: 'Dislike annulé' }))
                    .catch(error => res.status(400).json({ error }));
            } else {
                res.status(401).json({message: 'Vous avez déja voté'});
            }
        });
};