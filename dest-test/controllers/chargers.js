// module.exports = {
//   index:  chargersIndex,
//   show:   chargersShow,
//   create: chargersCreate,
//   update: chargersUpdate,
//   delete: chargersDelete
// };
//
// const Charger = require("../models/charger");
//
// function chargersIndex(req, res){
//   Charger.find({}, (err, chargers) => {
//     if (err) return res.status(500).json({ message: "Something went wrong." });
//     return res.status(200).json({ chargers });
//   });
// }
//
// function chargersShow(req, res){
//   Charger.findById(req.params.id, (err, charger) => {
//     if (err) return res.status(500).json({ message: "Something went wrong." });
//     if (!charger) return res.status(404).json({ message: "We fizzled out." });
//     return res.status(200).json({ charger });
//   });
// }
//
// function chargersCreate(req, res){
//   Charger.create(req.body.charger, (err, charger) => {
//     if (err) return res.status(500).json({ message: "Something went wrong." });
//     return res.status(201).json({ charger });
//   });
// }
//
// function chargersUpdate(req, res){
//   Charger.findByIdAndUpdate(req.params.id, req.body.charger, { new: true }, (err, charger) => {
//     if (err) return res.status(500).json({ message: "Something went wrong." });
//     return res.status(200).json({ charger });
//   });
// }
//
// function chargersDelete(req, res){
//   Charger.findByIdAndRemove(req.params.id, err => {
//     if (err) return res.status(500).json({ message: "Something went wrong." });
//     return res.status(204).json({ message: "Deleted." });
//   });
// }
