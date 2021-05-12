//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});


const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.route("/login")
.get(function(req,res){
    res.render("login");
})
.post(function(req,res){

    
        User.findOne(
            {
                email : req.body.username
            },
            function(e,foundUser){
                if(!e){
                    if(foundUser){

                        bcrypt.compare(req.body.password,foundUser.password,function(err,result){
                            if(result===true){
                                res.render("secrets");
                            }
                           
                        });
                    }
                }else{
                    console.log(e);
                }
            }
        );

});


app.route("/register")
.get(function(req,res){
    res.render("register");
})
.post(function(req,res){

    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        const newUser = new User({
            email : req.body.username,
            password :hash
        });
    
        newUser.save(function(e){
            if(!err){
                res.render("secrets");
            }else{
                console.log(e);
            }
        });
    });
  
});

app.listen(3000, function() {
    console.log("Server started successfully on port 3000");
});
