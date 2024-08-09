const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");

router.get("/", async (req, res) => {
 
  res.render("pages/home", {

  });
});

router.get("/viewOpenedTenders", async (req, res) => {
 
  res.render("pages/viewOpenedTenders", {

  });
});


router.get("/viewOpenedTenders100", async (req, res) => {
 
  res.render("pages/viewOpenedTenders100", {

  });
});



router.get("/getTaskList", async (req, res) => {
 
  res.render("pages/getTaskList", {

  });
});

router.get("/showOpenedTenderDetails", async (req, res) => {
 
  res.render("pages/showOpenedTenderDetails", {

  });
});


router.get("/prepareView", async (req, res) => {
 
  res.render("pages/prepareView", {

  });
});




module.exports = router;
