const express = require("express");

const router = express.Router();

router.get("/", function(req, res) {
  res.render("index");
});

router.post("/", (req, res) => {
  console.log(req);
  res.send("hello");
});

module.exports = router;
