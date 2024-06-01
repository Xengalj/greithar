const db = require("../models");
const User = db.user;
const Character = db.character;
// const Op = db.Sequelize.Op;

// Creates and returns a new character
exports.create = (req, res) => {
  res.status(200).send("Server Character Created");
}


// returns either a list of characters, or if a character_id was given, returns that character
exports.read = (req, res) => {
  if (req.body.character_id) {
    Character.findOne({
      where: { id: req.body.character_id }
    })
      .then(character => {
        if (!character) { return res.status(404).send({ message: "Character not found!" }); }
        // let user = 0; // get user id of character
        res.status(200).send({
          // user: user.id,
          character: character
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  } else {

    // findaAndCountAll //pagination
/*
const { count, rows } = await Project.findAndCountAll({
  where: {
    title: {
      [Op.like]: 'foo%',
    },
  },
  offset: 10,
  limit: 2,
});

console.log(count);
console.log(rows);
*/
    
    Character.findAll()
      .then(characters => {
        if (!characters) { return res.status(404).send({ message: "No characters found!" }); }
        res.status(200).send({
          characters: JSON.stringify(characters)
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  }
};

// Updates a character, given by character_id
exports.update = (req, res) => {
  Character.findOne({
    where: { id: req.body.character_id }
  })
    .then(character => {
      if (!character) { return res.status(404).send({ message: "Character not found!" }); }

      // set values to be updated
      for (const [key, value] of Object.entries(req.body)) {
        console.log(`${key}: ${value}`);
        character.key = value;
      }
      character.save();
      res.status(200).send({ character });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Deletes a character
exports.delete = (req, res) => {
  Character.findOne({
    where: { id: req.body.character_id }
  })
    .then(character => {
      if (!character) { return res.status(404).send({ message: "Character not found!" }); }
      character.destroy();
      res.status(200).send("Characer deleted");
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}
