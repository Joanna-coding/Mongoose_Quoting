const express = require("express");
const app = express();
app.use(express.static(__dirname + "/static"));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
// var path = require('path');

// this is the library for the request and response: npm install --save express-session
var session = require('express-session');
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

// this is for flash(messages. error for the views part)
const flash = require('express-flash');
app.use(flash());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');
mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
    name: {type:String},
    quote: {type: String}
}, {timestamps: true})

const User = mongoose.model('User', UserSchema);

app.get('/', function (req, res) {
    res.render("index");
})

app.post('/process', function(req, res){
    const user = new User();
    user.name = req.body.name;
    user.quote = req.body.quote;
    user.save(function(err){
        if(err){
            res.render('error', {errors: err})
        }
        else {

            res.redirect('/quotes');
        }
    })
})

app.get('/quotes', function(req, res){
    User.find({}, function(err, users){
        if(err){
            res.render('error', {errors:err})
        }
        else{
            res.render('quotes', {users: users});
        }

    })
    
})



app.listen(8000, function () {
    console.log("listening on port 8000");
});