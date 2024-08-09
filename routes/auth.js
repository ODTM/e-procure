const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();
const User = require('../models/userSchema.js');


router.get('/', (req, res) =>{

    res.render('auth/login');
});

router.get('/login',(req, res) =>{

    res.render('auth/login');
});

const { ensureAuthenticated} = require('../config/auth');
//we authenticate this route to secure the system
router.get('/register', (req, res) =>{


  res.render('auth/createAccount', {
  });
});


router.post('/register',async (req, res, next) =>{

  const {userName, email, password, role} = req.body;

  try {
    // Register the user and save to the database
    const user = await registerUser(userName, email, password, role);


  req.login(user,async (err) => {
    if (err) {
      console.error(`Error logging in after registration: ${err.message}`);
      return res.redirect("/")
      // return next(err);
    }
   return res.redirect("/")
  });
  }catch (error) {
    console.error(`Error registering user: ${error.message}`);
    // Handle registration error (e.g., display an error message)
    return res.redirect("/")
  }

});



router.post("/login",(req, res, next) => {

    if(true){

      res.redirect('/');
    }

});



async function registerUser(userName, email, password,role) {
  try {
    // Generate a salt to use for hashing the password
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If a user with the same email exists, throw an error
      return null
    }
    // Create a new user document with the hashed password
    
    const user = new User({
      userName,
      email,
     password:hashedPassword,
     role
    });

    // Save the user document to the database
    await user.save();
    return user;
    console.log(`User ${firstName} registered successfully`);
  } catch (error) {
    console.error(`Error registering user: ${error.message}`);
  }
}



router.get('/logout', (req, res) => {
  // Destroy the user session to log them out
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      // Handle error as needed
      res.status(500).send('Internal Server Error');
    } else {
      // Redirect the user to the login or home page
      res.redirect('/'); // You can replace '/' with the desired destination
    }
  });
});


module.exports = router
 