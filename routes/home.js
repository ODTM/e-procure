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


router.get("/currentTenders", async (req, res) => {
 
  res.render("pages/currentTenders", {

  });
});

router.get("/currentTenderDetails", async (req, res) => {
 
  res.render("pages/currentTenders", {

  });
});

router.get("/tenderDetails", async (req, res) => {
 
  res.render("pages/tenderDetails", {

  });
});

router.get("/clarification", async (req, res) => {
 
  res.render("pages/noClarification", {

  });
});

router.get("/notices", async (req, res) => {
 
  res.render("pages/notices", {

  });
});


router.get("/tenderDocuments", async (req, res) => {
 
  res.render("pages/tenderDocuments", {

  });
});


router.get("/notices", async (req, res) => {
 
  res.render("pages/tenderDocuments", {

  });
});

router.get("/tenderDocumentList", async (req, res) => {
 
  res.render("pages/tenderDocumentList", {

  });
});

router.post("/*",(req, res, next) => {
  res.render("pages/home", {

  });

});
module.exports = router;
