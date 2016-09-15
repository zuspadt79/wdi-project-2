const mongoose   = require("mongoose");
const config     = require("../config/config");
const Charger = require("../models/charger");
const path       = require("path");

mongoose.connect(config.db);

Charger.collection.drop();

// const chargers = [
//   {
//  url:"http://api.openchargemap.io/v2/poi/?output=kml&countrycode=GB&maxresults=50"
// }
// ];


chargers.forEach(charger => Charger.create(charger, (err, charger) => console.log(`${charger.name} was saved.`)));
