const express  = require("express");
const router   = express.Router();
const path     = require("path");

const statics  = require("../controllers/statics");

router.route("/")
  // .get(statics.home);

  .get((req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = router;
