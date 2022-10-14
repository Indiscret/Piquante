//Importation de mongoose et mongoose-unique-validator 
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

// Création du model user
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);