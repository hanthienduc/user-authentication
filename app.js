//jshint esversion:6
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.set("view engine", 'ejs')
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        if (!err) {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });

            newUser.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("secrets");
                }
            });
        }

    });

});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            bcrypt.compare(password, foundUser.password, function(err, result) {
                // result == true
                if (result) {
                    res.render("secrets");
                } else {
                    res.render("home");
                }
            });

        }
    });
});



app.listen(3000, function(err) {
    console.log("Server has started successfully.");
})