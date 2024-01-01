const express =  require('express');
const bodyParser = require('body-parser');
const ejs =  require('ejs');
require('dotenv').config();
const connectDB =  require('./src/db');
const mongoose = require('mongoose')


const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded(
    {
        extended:true
    }
));

const PORT = process.env.PORT || 5000;

connectDB();// Connect to Database


// SCHEMA

const userSchema = {
    email: String,
    password: String
}

const User = new mongoose.model("User", userSchema);

app.get('/',(req,res)=>{
    res.render('home.ejs');
})
 
app.get('/login',(req,res)=>{
    res.render('login.ejs');
})

app.get('/register',(req,res)=>{
    res.render('register.ejs');
})

app.post('/register',(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
    .then(() => {
        res.render("login");
    })
    .catch(err => {
        console.error(err);
        // Handle the error appropriately (send an error response, redirect, etc.)
    });

    
})
app.post('/login', async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    try {
        const foundUser = await User.findOne({ email: email }).exec();

        if (foundUser && foundUser.password === password) {
            res.render("secrets");
        } else {
            // Handle invalid login credentials (e.g., show an error message)
            res.render("login", { errorMessage: "Invalid username or password" });
        }
    } catch (err) {
        console.error(err);
        // Handle other potential errors (e.g., database connection issues)
        res.render("error", { errorMessage: "An unexpected error occurred" });
    }
});


app.get('/', (req,res)=>{
    res.render("submit")
})


app.listen(PORT, ()=>{
    console.log(`server is listening on port: ${PORT}`);
})
 
