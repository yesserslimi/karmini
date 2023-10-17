const mongoose = require('mongoose');

// Define the produit schema
const produitSchema = new mongoose.Schema({
  image: {
    type: String, // Assuming you store the image file path as a string
    required: true
  },
  discrip: {
    type: String,
    required: true
  },
  reff: {
    type: String,
    required: true
  },
  prix: {
    type: Number, // Assuming you store the price as a number
    required: true
  }
});

// Create a model from the schema
const Produit = mongoose.model('Produit', produitSchema);

module.exports = Produit;
