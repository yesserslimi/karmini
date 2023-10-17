const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://slimiyesser01:fYvOYE37cyRjVfk8@cluster0.gryxnpn.mongodb.net/yesser?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(`MongoDB Connection Error: ${err}`));
