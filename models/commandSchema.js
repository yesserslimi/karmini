const mongoose = require("mongoose");
const Schema  = mongoose.Schema ; 

// definir le schema 
const commandSchema = new Schema ({
    nom: String,
    prenom: String,
    telephone: String,
    adresse: String,
    ref : String,
    quant : Number,
});

// creation du modèle
const Command = mongoose.model ("Command" , commandSchema ) ;

// exporter le modèle
module.exports = Command;

