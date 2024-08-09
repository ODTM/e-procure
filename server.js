require("dotenv").config()
const express = require('express')
const app = express();
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const axios = require('axios')
// const cheerio = require('cheerio')
const session = require('express-session');
const flash = require('connect-flash');

// const puppeteer = require('puppeteer');

const mongoose = require('mongoose')
const passport = require('passport')
// configure passport

//route definition 
const homeRouter = require('./routes/home');

const authRouter = require('./routes/auth')
// require('./config/passport')(passport);


const { ensureAuthenticated} = require('./config/auth');

// mongoose.set('strictQuery', true);

// mongoose.connect("mongodb://127.0.0.1:27017/zppaprocure",{useNewUrlParser: true}).then(() => {
//   console.log('database is connected')
// }).catch((err) => console.log('error connecting to database ', err))
  
////setting up the server///////
// Configure Passport

 require('./config/passport')(passport);

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views/')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(express.urlencoded({ extended: false }))


app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false    
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



// ensureAuthenticated
app.use('/auth',authRouter);
app.use('/', homeRouter);


app.listen(process.env.PORT || 3030, () => console.log('Server is Running on port: 3030' ))