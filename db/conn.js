const mongoose = require("mongoose");


  const mongoUri = "mongodb+srv://vikal:vikal123@cluster0.ucxlxch.mongodb.net/?retryWrites=true&w=majority";





    mongoose.connect(mongoUri, {
         useNewUrlParser: true, useUnifiedTopology: true
     })
    .then(console.log("Connection Succesfull"))
    .catch((error) => console.log(console.log(error)));