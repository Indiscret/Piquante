// Importation de multer
const multer = require('multer');

// Crée un dictionnaire pour les extensions de fichier
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Enregistre les fichiers avec leurs destinaion
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');// Remplace les espaces par '_'
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);// Renome les fichier avec son nom, date et l'extension
    }
});

module.exports = multer({storage: storage}).single('image');