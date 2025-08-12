const db = require("../models");
const Character = db.character;
const User = db.user;
const Op = db.Sequelize.Op;

/***************************\
*                           *
*     CHARACTER CREATE      *
*                           *
\***************************/
// Creates a blank character, to then be edited
// sets user to whoever created the char, and admins can update later
exports.create = (req, res) => {
  Character.create()
  .then(character => {
    character.setUser(req.userID)
    .then(() => {
      res.status(201).send({ character: character });
    })
    .catch(err => {
      // error setting user / player
      res.status(500).send({ message: err.message });
    });
  })
  .catch(err => {
    // error creating character
    res.status(500).send({ message: err.message });
  });
}

/***************************\
*                           *
*      CHARACTER READ       *
*                           *
\***************************/
// returns either a specific character (character_id), a list belonging to a user (user_id), or all characters
exports.read = (req, res) => {
  // get specific character
  if (req.body.character_id) {
    Character.findAll({ where: { id: req.body.character_id }, include: User })
    .then(character => {
      if (!character) { return res.status(404).send({ message: "Character not found!" }); }
      res.status(200).send({ character: character });
    })
    .catch(err => {
      // error getting character
      res.status(500).send({ message: err.message });
    });

  // get user's characters
  } else if (req.body.user_id) {
    Character.findAll({ where: { userId: req.body.user_id }, include: User })
    .then(character => {
      if (!character) { return res.status(404).send({ message: "Character not found!" }); }
      res.status(200).send({ character: character });
    })
    .catch(err => {
      // error getting character
      res.status(500).send({ message: err.message });
    });

  // get all characters
  } else {
    Character.findAndCountAll({
      include: User,
      offset: req.body.offset,
      limit: req.body.limit
    })
    .then(characters => {
      if (!characters) { return res.status(404).send({ message: "No characters found!" }); }
      res.status(200).send({ characters: JSON.stringify(characters) });
    })
    .catch(err => {
      // error getting characters
      res.status(500).send({ message: err.message });
    });



  }
};

/***************************\
*                           *
*     CHARACTER UPDATE      *
*                           *
\***************************/
// Updates a character, given by character_id
exports.update = (req, res) => {
  let isAdmin = false;
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") { isAdmin = true; }
      }

      Character.findOne({ where: { id: req.body.id }, include: User })
      .then(character => {
        if (!character) { return res.status(404).send({ message: "Character not found!" }); }

        // only let users edit their own, or admins edit any
        if (isAdmin || character.user.id == req.user.id) {
          // set values to be updated
          for (const [key, value] of Object.entries(req.body)) {
            console.log(`${key}: ${value}`);
            if (key == "id") { continue; }
            if (isAdmin && key == "user") { character.setUser(value.id); }
            character[key] = value;
          }
          character.save();

          res.status(200).send({ character });
        } else {
          res.status(403).send({ message: `You do not have permissions to delete this character` });
        }
      })
      .catch(err => {
        // error finding character
        res.status(500).send({ message: err.message });
      });

    });
  });
};

/***************************\
*                           *
*     CHARACTER DELETE      *
*                           *
\***************************/
// Deletes a character
exports.delete = (req, res) => {
  // only let users delete their own, or admins delete any
  let isAdmin = false;
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name == "admin") { isAdmin = true; }
      }

      // Do the deleting
      Character.findOne({ where: { id: req.body.id }, include: User })
      .then(character => {
        if (!character) { return res.status(404).send({ message: "Character not found!" }); }
        if (isAdmin || req.userId == character.userId) {
          character.destroy();
          res.status(200).send("Character deleted");
        } else {
          res.status(403).send({ message: `You do not have permissions to delete this character` });
        }
      })
      .catch(err => {
        // error finding character
        res.status(500).send({ message: err.message });
      });

    });
  });

}
