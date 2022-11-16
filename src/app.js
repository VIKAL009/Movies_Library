const express = require("express");
const bcrypt = require("bcryptjs");

const sessions = require("express-session");
const mongodbSession = require("connect-mongodb-session")(sessions);
const request = require('request-promise');
const app = express();
const port = process.env.PORT||80;
const apiUrl = "http://www.omdbapi.com/?apikey=55b8eef6&t=";

const path = require("path");

require("../db/conn")
const User = require("../db/modal/UserModal");
const List = require("../db/modal/ListModal");
const mongoUri = "mongodb+srv://vikal:vikal123@cluster0.ucxlxch.mongodb.net/?retryWrites=true&w=majority";
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: false }));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));


app.listen(port,()=>{
    console.log(`hello port ${port}`);
})



const store = new mongodbSession({
    uri: mongoUri,
    collection: "mySessions"
});

app.use(sessions({
    secret: 'key that sign cookie',
    resave: false,
    saveUninitialized: false,
    store: store
}));



app.get("/",(req,res)=>{
    
    // if(!req.session.isAuth)
    //     res.redirect("/register");
    // const params = {'username':req.session.username};
    // res.render("index.ejs",params);
    // console.log("shubh");
    res.send("hello ");

})

app.get("/mylist",async (req,res)=>{
    
    if(!req.session.isAuth)
        res.redirect("/register");

    const myMovies = await List.find({ userid:req.session.userId }).exec();
    const arr = [];
    const appp = "http://www.omdbapi.com/?apikey=55b8eef6&i=";
    var params = {'msg':"vikal"};
    for (const element of myMovies) {
        var xx = element.movieid;
        console.log(xx);
        await request(appp+xx, { json: true },  (err, res, body) => {
            if (err) { return console.log(err); }
            const {Title , Year, Released, Runtime, Genre, Director, Actors,Plot,Country,Poster,imdbID,Rating} = body;
            const p = {'Title':Title,'Year':Year,'Released':Released,'Runtime':Runtime,'Genre':Genre,'Director':Director,'Actors':Actors,'Plot':Plot,'Country':Country,'Poster':Poster,'imdbID':imdbID,'Rating':Rating};  
            arr.push(p);
          });
        
        //    console.log(params);
    }
    params = {'movies':arr}; 
    res.status(200).render("myList.ejs",params);

})

app.get("/register",(req,res)=>{

    res.status(200).render("register.ejs");
    // res.send("This is my home page");

})

app.post("/search",async (req,res)=>{

    var params={'msg':"Message"};
    // console.log(req.body.search);
    await request(apiUrl+req.body.search, { json: true },  (err, res, body) => {
      if (err) { return console.log(err); }
      const {Title , Year, Released, Runtime, Genre, Director, Actors,Plot,Country,Poster,imdbID} = body;
      params = {'Title':Title,'Year':Year,'Released':Released,'Runtime':Runtime,'Genre':Genre,'Director':Director,'Actors':Actors,'Plot':Plot,'Country':Country,'Poster':Poster,'imdbID':imdbID};  
    });
    res.status(200).render("movie.ejs",params);
   
})

app.post("/addMovie",async (req,res)=>{
    
    const { imdbID } = req.body;
    
    let isAlready = await List.findOne({movieid: imdbID,userid:req.session.userId});
   // console.log(imdbID+"   "+req.session.userId);
     if(!isAlready){
         list = new List({
            movieid:imdbID,
            userid:req.session.userId
        });
        //console.log(list);
     await list.save();
    }
    
    res.status(200).redirect("/");

});


app.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    let user = await User.findOne({ email });
    //console.log(user);
    if (!user) {
        res.redirect("/register");
    }
    //const enter = 
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
        // console.log("Wrong Pass");
        res.redirect("/register");
    }
    else {
        req.session.isAuth = true;
        req.session.userId = user._id;
        req.session.username = user.username;
        res.redirect("/");
    }

});
 

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {

        res.redirect("register");
    });
});



// resister user --------------------------------------------
app.post("/signup", jsonParser, async(req, res) => {
    const { username, email, pass,cpass } = req.body;
    let user = await User.findOne({ email });
    if (user) {

        res.redirect("/register");

    }
    const hashpass = await bcrypt.hash(pass, 10);
    user = new User({
        username,
        email,
        password: hashpass,
        
        
    });

    await user.save();
    
    res.redirect("/");
});



