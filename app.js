const express = require("express");
const multer = require('multer');
const path = require('path');
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { error } = require("console");
const bcrypt = require('bcrypt');
const app = express();
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const URI = "mongodb+srv://slimiyesser01:fYvOYE37cyRjVfk8@cluster0.gryxnpn.mongodb.net/yesser?retryWrites=true&w=majority";
const client = new MongoClient(URI, { useNewUrlParser: true });
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
require('./db');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
// Define the schema for the produit
const produitSchema = new mongoose.Schema({
  image: String,
  nom: String ,
  discrip: String,
  reff: String,
  prix: Number
});

// Create a model from the schema
const Produit = mongoose.model('Produit', produitSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');
app.use(upload);

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Only image files (jpeg, jpg, png, gif) are allowed!');
  }
}

// Serve static files from the 'uploads' directory
app.use(express.static('uploads'));

// Handle form submission
app.post('/ajouter', async (req, res) => {
  try {
    const nom = req.body.nom;
    const discrip = req.body.discrip;
    const reff = req.body.reff;
    const prix = req.body.prix;

    // Get the uploaded image filename
    const imageFilename = req.file.filename;

    // Create a new Produit document
    const newProduit = new Produit({
      image: imageFilename,
      nom : nom, 
      discrip: discrip,
      reff: reff,
      prix: prix
    });

    // Save the newProduit to the database using await
    newProduit.save();

    // Redirect to a success page or send a response as needed
    res.redirect('/produit');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while saving the product.' });
  }
});

app.get('/vitrine', async (req, res) => {
  try {
    const products = await Produit.find(); // Retrieve all products from the database
    res.render('vitrine', { products }); // Pass the products to the vitrine.ejs template
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/delete-product', function(req, res) {
  const reff = req.body.reff;
  Produit.deleteOne({ reff: reff })
    .then(() => {
      console.log('produit deleted from MongoDB Atlas');
      res.redirect('/produit');
    })
    .catch((err) => console.log(err));
});




// commander
const Command = require("./models/commandSchema");
//const { Schema, default: mongoose } = require("mongoose");
app.post("/all-command", (req, res) => {
    const command = new Command(req.body);
     
    console.log(req.body);
     
    command
        .save( )
        .then( result => {
          res.redirect("/commander");

        })
        .catch( err => {
          console.log(err);
        });
}); 

// show all commands 

app.get('/commands', (req, res) => {
  Command.find()
      .then((commands) => {
          res.render('commands', { commands: commands }); 
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Internal Server Error');
      });
});







// connection administrative

// Define a route for rendering the connectad.ejs view
app.get('/connectad', (req, res) => {
  res.render('connectad', { errorMessage: '' });
});

// Define a route to handle form submission on connectad.ejs
app.post('/connectad', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Check for validation and set the error message if needed
  let errorMessage = '';
  if (email !== "karmini@gmail.com" || password !== "kiko1234") {
    errorMessage = 'Invalid email or password';
    res.render('connectad', { errorMessage });
  } else {
    res.render('admin'); // Render the 'admin.ejs' view for successful login
  }
});

// supp commands 
app.post("/supprimercommands", (req, res) => {
  // Use the Command model to delete all commands
  Command.deleteMany({})
    .then(() => {
      console.log("Commands deleted from MongoDB Atlas");
      res.redirect("/commands");
    })
    .catch((err) => {
      console.error("Error deleting commands:", err);
      res.status(500).send("Internal Server Error");
    });
});



// diconnection de l'espace admin

app.post('/diconnectad', function(req, res) {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  } else {
    res.redirect('/');
  }
});

app.get("/produit", (req, res)=>{
  res.render("produit");
});

app.get("/", (req, res)=>{
    res.render("main");
});
app.get("/main", (req, res)=>{
  res.render("main");
});

app.get("/commands", (req, res)=>{
  res.render("commands")
});

app.get("/commander", (req, res)=>{
    res.render("commander")
});

app.get("/vitrine", (req, res)=>{
  res.render("vitrine")
});

app.get("/connectad", (req, res)=>{
  res.render("connectad")
});

app.get("/admin", (req, res)=>{
  res.render("admin")
});


app.get("/login", (req, res)=>{
  res.render("login")
});


app.listen(port, ()=>{
    console.log("Listening on port : 80")
});
