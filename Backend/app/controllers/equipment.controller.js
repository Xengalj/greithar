const db = require("../models");
const User = db.user;
const Equipment = db.equipment;
// const Op = db.Sequelize.Op; // operators for where clause


// returns either a list of equipment, or if an item_type was given, returns that type of item
exports.read = (req, res) => {
  if (req.body.item_type) {
    Equipment.findOne({
      where: { type: req.body.item_type }
    })
      .then(equipment => {
        if (!equipment) { return res.status(404).send({ message: `No ${req.body.item_type} found!` }); }
        res.status(200).send({
          data: equipment
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  } else {
    Equipment.findAll()
      .then(equipments => {
        if (!equipments) { return res.status(404).send({ message: "No equipment found!" }); }
        res.status(200).send({
          data: equipments
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  }
};

exports.update = (req, res) => {
  Equipment.findOne({
    where: { type: req.body.item_type }
  })
    .then(equipment => {
      if (!equipment) { return res.status(404).send({ message: `No ${req.body.item_type} found!` }); }

      let newContent = {
        type: req.body.item_type,
        items: req.body.items
      };
      equipment.update({
        type: newContent.type,
        items: newContent.items
      })

      res.status(200).send({ equipment });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};



exports.delete = (req, res) => {
  res.status(200).send("Server DELETE ITEM SET.");
  // const jane = await User.create({ name: 'Jane' });
  // console.log(jane.name); // "Jane"
  // console.log(jane.toJSON()); // This is good!
  // await jane.destroy();
};
